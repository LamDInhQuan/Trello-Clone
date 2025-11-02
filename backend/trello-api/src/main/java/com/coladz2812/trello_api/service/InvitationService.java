package com.coladz2812.trello_api.service;


import com.coladz2812.trello_api.dto.request.InvitationRequest;
import com.coladz2812.trello_api.dto.response.BoardInvitationResponse;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.dto.response.InvitationResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.BoardMapper;
import com.coladz2812.trello_api.mapper.InvitationMapper;
import com.coladz2812.trello_api.mapper.UserMapper;
import com.coladz2812.trello_api.model.Board;

import com.coladz2812.trello_api.model.Card;
import com.coladz2812.trello_api.model.Invitation;
import com.coladz2812.trello_api.model.User;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.InvitationRepository;
import com.coladz2812.trello_api.repository.UserRepository;

import com.coladz2812.trello_api.util.BoardInvitationStatus;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Service
public class InvitationService {

    InvitationRepository invitationRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    BoardRepository boardRepository;
    InvitationMapper invitationMapper;
    BoardMapper boardMapper ;

    public void invitationMapper(InvitationResponse response, Invitation invitation, User inviter, User invitee , Board board) {
        var user1 = userMapper.toUserResponse(inviter);
        user1.setUserId(inviter.getId().toString());
        response.setInviter(user1);
        var user2 = userMapper.toUserResponse(invitee);
        user2.setUserId(invitee.getId().toString());
        response.setInvitee(user2);
        response.setBoard(boardMapper.toBoardResponse(board));
        response.getBoardInvitations().setBoardId(invitation.getBoardInvitations().getBoardId().toString());
    }


    public InvitationResponse createNewInvitation(InvitationRequest request) { // ownerId là authentication
        User inviter = userRepository.findById(request.getInviterId()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        User invitee = userRepository.findByEmail(request.getInviteeEmail()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        Board board = boardRepository.getBoardByBoardIdAndUserId(inviter.getId(), request.getBoardInvitations().getBoardId().toHexString());
        Invitation invitation = invitationMapper.toInvitation(request);
        invitation.setInviterId(new ObjectId(inviter.getId()));
        invitation.setInviteeId(new ObjectId(invitee.getId()));
        InvitationResponse response = invitationMapper.invitationResponse(invitationRepository.save(invitation));
        invitationMapper(response, invitation, inviter, invitee , board); // mapper invitation
        return response;
    }

    public List<Document> getNotifications(String userId) {
        var notifications = invitationRepository.getNotificationsByUserId(userId);
        return notifications;
    }

    public InvitationResponse updateInvitation(String userId, InvitationRequest request) { // ownerId là authentication
        Invitation invitation = invitationRepository.findById(request.getInvitationId()).orElseThrow(() -> {
            throw new AppException(ErrorCode.INVITATION_NOT_FOUND);
        });
        // nếu trạng thái invitation không phải PENDING thì return ko xử lí
        if(!invitation.getBoardInvitations().getStatus().equals(BoardInvitationStatus.PENDING.name())){
            throw new AppException(ErrorCode.INVITATION_ALREADY_UPDATE);
        }
        // tìm board
        Board board = boardRepository.findById(invitation.getBoardInvitations().getBoardId().toString()).orElseThrow(() -> {
            throw new AppException(ErrorCode.BOARD_NOT_FOUND);
        });

        Set<String> usersInBoard = new HashSet<>(board.getOwnerIds());
        usersInBoard.addAll(board.getMemberIds());
        log.error("usersInBoard" + usersInBoard);

        // nếu account đang đăng nhập không phải thằng user được mời vào board thì return
        if(!userId.equals(invitation.getInviteeId().toString())){
            // thêm user vào board
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        }

        // nếu là thành viên của board return
        if (request.getStatus().equals(BoardInvitationStatus.SUCCESSED.name()) && usersInBoard.contains(userId)) {
            // thêm user vào board
            throw new AppException(ErrorCode.USER_EXIST_IN_BOARD);
        }
        if ((request.getStatus().equals(BoardInvitationStatus.SUCCESSED.name()))) {
            board.getMemberIds().add(userId);
            boardRepository.save(board);
        }
        // câp nhật invitation
        invitation.getBoardInvitations().setStatus(request.getStatus());
        invitation.setUpdatedAt(new Date());

        InvitationResponse response = invitationMapper.invitationResponse(invitationRepository.save(invitation));
        User inviter = userRepository.findById(invitation.getInviterId().toString()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        // log.error("inviter"+inviter);
        User invitee = userRepository.findById(invitation.getInviteeId().toString()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        // log.error("invitee"+invitee);
        invitationMapper(response, invitation, inviter, invitee , board); // mapper invitation

        return response;
    }
}
