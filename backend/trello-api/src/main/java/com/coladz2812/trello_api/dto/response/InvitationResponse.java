package com.coladz2812.trello_api.dto.response;

import com.coladz2812.trello_api.dto.request.BoardInvitationRequest;
import com.coladz2812.trello_api.model.BoardInvitation;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class InvitationResponse {
    String invitationId;
    UserResponse inviter;
    UserResponse invitee;
    BoardResponse board ;
    String type;
    BoardInvitationResponse boardInvitations;
    Date createdAt ;
    Date updatedAt;
    Boolean _destroy ;
}
