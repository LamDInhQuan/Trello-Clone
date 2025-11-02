package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.model.Card;
import org.bson.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CardMapper {
    @Mapping(target = "boardId", ignore = true)
    @Mapping(target = "columnId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "_destroy", ignore = true)
    @Mapping(target = "cardCover", ignore = true)
    @Mapping(target = "comments", ignore = true)
    Card toCard(CardRequest cardRequest);

    @Mapping(target = "boardId", ignore = true)
    @Mapping(target = "columnId", ignore = true)
    CardResponse toCardResponse(Card card);


}
