package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.response.InvitationResponse;
import com.coladz2812.trello_api.service.NotificationsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
public class NotificationsController {

    NotificationsService notificationsService ;

    @MessageMapping("/notifications")
    public void handleInvitationNotifications(@Payload InvitationResponse invitation){
        // Hoặc dùng log
        log.info("📩 Received invitation payload: {}", invitation);

        notificationsService.sendInvitationNotifications(invitation);
    }
}
