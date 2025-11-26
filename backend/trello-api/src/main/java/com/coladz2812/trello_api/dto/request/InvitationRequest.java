package com.coladz2812.trello_api.dto.request;

import com.coladz2812.trello_api.classValidation.InvitationUpdateStatus;
import com.coladz2812.trello_api.model.BoardInvitation;
import com.coladz2812.trello_api.validator.ValueIn;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class InvitationRequest {
    @NotBlank(message = "INVITATION_ID_NOTNULL", groups = {InvitationUpdateStatus.class}) // dùng cho việc update cần truyền
    // id của invitation còn thêm bản ghi invitation thì ko cần
    String invitationId;
    String inviterId;
    String inviteeEmail;
    String type;
    BoardInvitation boardInvitations;
    Date createdAt;
    Date updatedAt;
    Boolean _destroy;

    @ValueIn(values = {"SUCCESSED", "REJECTED"}, message = "STATUS_INVITATION_ERROR", groups = {InvitationUpdateStatus.class})
    String status;
}
