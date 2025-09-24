package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.model.Card;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CardMapper {
    @Mapping(target = "boardId", ignore = true)
    @Mapping(target = "columnId", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    @Mapping(target = "_destroy", ignore = true)
    Card toCard(CardRequest cardRequest);

    @Mapping(target = "boardId", ignore = true)
    @Mapping(target = "columnId", ignore = true)
    CardResponse toCardResponse(Card card);
}
