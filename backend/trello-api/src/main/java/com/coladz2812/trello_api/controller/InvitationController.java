package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.classValidation.InvitationUpdateStatus;
import com.coladz2812.trello_api.dto.request.BoardInvitationRequest;
import com.coladz2812.trello_api.dto.request.BoardRequest;
import com.coladz2812.trello_api.dto.request.BoardRequestUpdate;
import com.coladz2812.trello_api.dto.request.InvitationRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.dto.response.InvitationResponse;
import com.coladz2812.trello_api.model.BoardInvitation;
import com.coladz2812.trello_api.service.BoardService;
import com.coladz2812.trello_api.service.InvitationService;
import com.coladz2812.trello_api.util.BoardInvitationStatus;
import com.coladz2812.trello_api.util.InvitationType;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/invitation")
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }
public class InvitationController {
    InvitationService invitationService;
//    RequestContext requestContext;

    @PostMapping("/newInvitation")
    public ApiResponse<InvitationResponse> createNewInvitation(@Valid @RequestBody BoardInvitationRequest request, Authentication authentication) {
        InvitationRequest invitationRequest = InvitationRequest.builder()
                .inviterId(authentication.getPrincipal().toString())
                .inviteeEmail(request.getInviteeEmail())
                .type(InvitationType.BOARD_INVITATION.name())
                .boardInvitations(BoardInvitation.builder()
                        .boardId(new ObjectId(request.getBoardId().toString()))
                        .status(BoardInvitationStatus.PENDING.name()).build())
                .build();
        var invitationResponse = invitationService.createNewInvitation(invitationRequest);
        ApiResponse<InvitationResponse> apiResponse = ApiResponse.<InvitationResponse>builder().result(invitationResponse).build();
        return apiResponse;
    }

    @GetMapping("/getNotifications")
    public ApiResponse<List<Document>> getNotifications(Authentication authentication) {
        var invitationResponse = invitationService.getNotifications(authentication.getPrincipal().toString());
        ApiResponse<List<Document>> apiResponse = ApiResponse.<List<Document>>builder().result(invitationResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateInvitation")
    public ApiResponse<InvitationResponse> updateInvitation(Authentication authentication, @Validated(InvitationUpdateStatus.class)
                                                            @RequestBody InvitationRequest request) {
        var invitationResponse = invitationService.updateInvitation(authentication.getPrincipal().toString(),request);
        ApiResponse<InvitationResponse> apiResponse = ApiResponse.<InvitationResponse>builder().result(invitationResponse).build();
        return apiResponse;
    }
}
