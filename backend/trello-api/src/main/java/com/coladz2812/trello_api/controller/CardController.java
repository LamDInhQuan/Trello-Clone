package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.service.CardService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/card")
public class CardController {

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
}
