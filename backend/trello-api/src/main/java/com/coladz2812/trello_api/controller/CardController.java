package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.classValidation.CardDescriptionUpdate;
import com.coladz2812.trello_api.classValidation.CardTitleUpdate;
import com.coladz2812.trello_api.classValidation.ColumnInfoUpdate;
import com.coladz2812.trello_api.classValidation.TwoColumnsUpdate;
import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.request.CardRequestUpdate;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.request.CommentRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.model.Comment;
import com.coladz2812.trello_api.repository.UserRepository;
import com.coladz2812.trello_api.service.CardService;
import com.coladz2812.trello_api.util.FileUploadUtil;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bson.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/card")
public class CardController {

    private static final Log log = LogFactory.getLog(CardController.class);
    CardService cardService;
    private final UserRepository userRepository;

    @PostMapping("/addCard")
    public ApiResponse<CardResponse> addCard(@RequestBody @Valid CardRequest request) {
        var cardResponse = cardService.addCard(request);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @GetMapping("/getCardById/{id}")
    public ApiResponse<CardResponse> getCardById(@PathVariable String id) {
        var cardResponse = cardService.getCardById(id);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardTitle")
    public ApiResponse<CardResponse> updateCardTitle(@Validated(CardTitleUpdate.class) @RequestBody CardRequestUpdate request ,Authentication authentication) {
        var cardResponse = cardService.updateCardInfo(request ,authentication.getPrincipal().toString());
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardDescription")
    public ApiResponse<CardResponse> updateCardDescription(@Validated(CardDescriptionUpdate.class) @RequestBody CardRequestUpdate request ,Authentication authentication) {
        var cardResponse = cardService.updateCardInfo(request ,authentication.getPrincipal().toString());
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardCover")
    public ApiResponse<CardResponse> updateCardDescription(
            @RequestParam("cardCover") MultipartFile cardCoverFile, @RequestParam("cardId") String cardId , Authentication authentication) {
        var cardResponse = cardService.uploadCardCover(cardId,authentication.getPrincipal().toString(), cardCoverFile);
        FileUploadUtil.assertAllowed(cardCoverFile);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardComment")
    public ApiResponse<CardResponse> updateCardDescription(Authentication authentication, @Valid @RequestBody CommentRequest request) {
        log.error("authentication.getName()"+authentication.getName());
        var user = userRepository.findById(authentication.getPrincipal().toString())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        Comment comment = Comment.builder()
                .userId(authentication.getPrincipal().toString())
                .userEmail(authentication.getDetails().toString()) // lấy detail() từ authentication
                .userAvatar(user.getAvatar())
                .userDisplayname(user.getDisplayName())
                .content(request.getContent())
                .commentAt(new Date()).build();
        var cardResponse = cardService.addCardComment(request.getCardId(), comment);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }
}
