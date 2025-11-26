package com.coladz2812.trello_api.service;

import com.cloudinary.Cloudinary;
import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.request.CardRequestUpdate;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.CardMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Card;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.model.Comment;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.CardRepository;
import com.coladz2812.trello_api.repository.ColumnRepository;
import com.coladz2812.trello_api.util.ConstantsUtil;
import com.coladz2812.trello_api.util.FileUploadUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CardService {

    CardRepository cardRepository;
    CardMapper cardMapper;

    ColumnRepository columnRepository;
    BoardRepository boardRepository;
    Cloudinary cloudinary;

    public void cardMapper(CardResponse cardResponse, Card card) {
        cardResponse.setBoardId(card.getBoardId().toString());
        cardResponse.setColumnId(card.getColumnId().toString());
        cardResponse.setCreatedAt(card.getCreatedAt());
        cardResponse.setUpdatedAt(card.getUpdatedAt());
    }

    public CardResponse addCard(CardRequest request) {
        Card card = cardMapper.toCard(request);

        // tự xử lý ID
        // convert id thủ công
        if (ObjectId.isValid(request.getBoardId())) {
            card.setBoardId(new ObjectId(request.getBoardId()));
        } else {
            throw new AppException(ErrorCode.INVALID_OBJECT_ID);
        }

        if (ObjectId.isValid(request.getColumnId())) {
            card.setColumnId(new ObjectId(request.getColumnId()));
        } else {
            throw new AppException(ErrorCode.INVALID_OBJECT_ID);
        }

        Board board = boardRepository.findById(request.getBoardId().toString()).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND));
        Column column = columnRepository.findById(request.getColumnId().toString()).orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        Card savedCard = cardRepository.save(card);
        column.getCardOrderIds().add(savedCard.getCardId());
        columnRepository.save(column);
        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        cardMapper(cardResponse, card);
        return cardResponse;
    }

    public CardResponse getCardById(String id) {
        Optional<Card> card = cardRepository.findById(id);
        return cardMapper.toCardResponse(card.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND)));
    }

    public CardResponse updateCardInfo(CardRequestUpdate request, String userId) {
        Card card = cardRepository.findCardDetailById(request.getCardId(), userId);
//        log.error("card"+card);
        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            card.setTitle(request.getTitle());
            card.setUpdatedAt(new Date());
        }
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            card.setDescription(request.getDescription());
            card.setUpdatedAt(new Date());
        }
        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        cardMapper(cardResponse, card);
        return cardResponse;
    }

    public CardResponse updateMemberInCard(CardRequestUpdate request, String userId) {
        Card card = cardRepository.findCardDetailByUserIdAndMemberId(request.getCardId(), userId, request.getUserId());
//        log.error("card"+card);
        if (request.getUserId() != null && !request.getUserId().isEmpty()
                && request.getCardMemberAction() != null && !request.getCardMemberAction().isEmpty()) {

            if (request.getCardMemberAction().equals(ConstantsUtil.CardMemberActions.ADD)) {
                if (!card.getMemberIds().contains(request.getUserId().toString())) {
                    card.getMemberIds().add(request.getUserId().toString());
                }
            } else if (request.getCardMemberAction().equals(ConstantsUtil.CardMemberActions.REMOVE)) {
                card.getMemberIds().remove(request.getUserId().toString());
            }
            card.setMemberIds(card.getMemberIds());
            card.setUpdatedAt(new Date());
        }
        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        cardMapper(cardResponse, card);
        return cardResponse;
    }

    public CardResponse uploadCardCover(String cardId, String userId, MultipartFile cardCoverFile) {
        Card card = cardRepository.findCardDetailById(cardId, userId);
        log.error("cardCoverFile" + cardId);
        // 2. Update avatar
        if (!cardCoverFile.isEmpty()) {
//            log.error("avatarFile : "+avatarFile);
            try {
                var uploadResponse = cloudinary.uploader().upload(cardCoverFile.getBytes(), Map.of("folder", "cardCovers", // folder trên Cloudinary
                        "public_id", FileUploadUtil.getFileName(cardCoverFile.getOriginalFilename()), // tên file
                        "overwrite", true,
                        "resource_type", "image"));
//                log.error("uploadResponse"+uploadResponse);
                String cardCoverURL = uploadResponse.get("secure_url").toString();
                card.setCardCover(cardCoverURL);
                card.setUpdatedAt(new Date());
                CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
                cardMapper(cardResponse, card);
                return cardResponse;
            } catch (IOException e) {
                throw new AppException(ErrorCode.UPLOAD_AVATAR_FAILED);
            }

        }
        return null;
    }

    public CardResponse addCardComment(String cardId, Comment comment) {
//        log.error("comment"+comment);
        Card card = cardRepository.findCardDetailById(cardId, comment.getUserId());
//        log.error("card"+card);
        card.getComments().add(0, comment);
        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        cardMapper(cardResponse, card);
        return cardResponse;
    }
}
