package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.CardMapper;
import com.coladz2812.trello_api.model.Card;
import com.coladz2812.trello_api.repository.CardRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE , makeFinal = true)
@RequiredArgsConstructor
public class CardService {

    CardRepository cardRepository ;
    CardMapper cardMapper ;

    public CardResponse addCard(CardRequest request){
        Card card = cardMapper.toCard(request);
        return cardMapper.toCardResponse(cardRepository.save(card));
    }

    public CardResponse getCardById(String id){
        Optional<Card> card = cardRepository.findById(id);
        return cardMapper.toCardResponse(card.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND))) ;
    }
}
