package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.response.InvitationResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.model.User;
import com.coladz2812.trello_api.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Service
public class NotificationsService {

    // Nó chính là “công cụ trung gian” để server chủ động gửi (push) thông điệp đến client qua WebSocket.
    SimpMessagingTemplate simpMessagingTemplate ;
    InvitationService invitationService;
    UserRepository userRepository;

    public void sendInvitationNotifications(InvitationResponse invitationResponse){
        // "/topic" : broadcast cho tất cả subscriber , Ai subscribe /topic/... thì đều nhận message.
        // "/queue/" ... — gửi riêng cho user , Ý nghĩa: Đây là queue riêng cho từng user (user destination).
        //                   Chỉ user có principal trùng với userId mới nhận message.
        User user  = userRepository.findByEmail(invitationResponse.getInvitee().getEmail()).orElseThrow(() -> {
            throw new AppException(ErrorCode.USER_EMAIL_NOT_FOUND);
        });
        simpMessagingTemplate.convertAndSendToUser(user.getId().toString(),"/queue/invitation",invitationResponse);
    }
}
