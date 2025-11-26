package com.coladz2812.trello_api.dto.request;

import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardInvitationRequest {
    Object boardId;

    @Email(message = "EMAIL_NOT_VALID")
    String inviteeEmail;
}