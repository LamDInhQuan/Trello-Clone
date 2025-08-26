package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.model.Card;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CardMapper {
    Card toCard(CardRequest cardRequest);

    CardResponse toCardResponse(Card card);
}
