package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.request.InvitationRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.dto.response.InvitationResponse;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.model.Invitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvitationMapper {
    @Mapping(target = "inviterId", ignore = true) // bỏ qua ObjectId
    @Mapping(target = "inviteeId", ignore = true) // bỏ qua ObjectId
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "_destroy", ignore = true)
    Invitation toInvitation(InvitationRequest request);

    @Mapping(target = "inviter", ignore = true) // bỏ qua ObjectId
    @Mapping(target = "invitee", ignore = true) // bỏ qua ObjectId
    @Mapping(target = "boardInvitations.boardId", ignore = true)
    InvitationResponse invitationResponse(Invitation invitation);
}
