package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.classValidation.CardDescriptionUpdate;
import com.coladz2812.trello_api.classValidation.CardTitleUpdate;
import com.coladz2812.trello_api.classValidation.ColumnInfoUpdate;
import com.coladz2812.trello_api.classValidation.TwoColumnsUpdate;
import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.request.CardRequestUpdate;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.service.CardService;
import com.coladz2812.trello_api.util.FileUploadUtil;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/card")
public class CardController {

    private static final Log log = LogFactory.getLog(CardController.class);
    CardService cardService;

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
    public ApiResponse<CardResponse> updateCardTitle(@Validated(CardTitleUpdate.class) @RequestBody CardRequestUpdate request) {
        var cardResponse = cardService.updateCardInfo(request);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardDescription")
    public ApiResponse<CardResponse> updateCardDescription(@Validated(CardDescriptionUpdate.class) @RequestBody CardRequestUpdate request) {
        var cardResponse = cardService.updateCardInfo(request);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardCover")
    public ApiResponse<CardResponse> updateCardDescription(
            @RequestParam("cardCover") MultipartFile cardCoverFile, @RequestParam("cardId") String cardId) {
        var cardResponse = cardService.uploadCardCover(cardId, cardCoverFile);
        FileUploadUtil.assertAllowed(cardCoverFile);
        ApiResponse<CardResponse> apiResponse = ApiResponse.<CardResponse>builder().result(cardResponse).build();
        return apiResponse;
    }
}
