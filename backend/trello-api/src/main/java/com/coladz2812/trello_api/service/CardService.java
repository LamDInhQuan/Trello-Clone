package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.CardMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Card;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.CardRepository;
import com.coladz2812.trello_api.repository.ColumnRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE , makeFinal = true)
@RequiredArgsConstructor
public class CardService {

    CardRepository cardRepository ;
    CardMapper cardMapper ;

    ColumnRepository columnRepository;
    BoardRepository boardRepository ;

    public CardResponse addCard(CardRequest request){
        Card card = cardMapper.toCard(request);

        // tự xử lý ID
        // convert id thủ công
        if (ObjectId.isValid(request.getBoardId())) {
            card.setBoardId(new ObjectId(request.getBoardId()));
        } else {
            throw new AppException(ErrorCode.INVALID_OBJECT_ID);
        }

        if (ObjectId.isValid(request.getColumnId())) {
            card.setColumnId(new ObjectId(request.getColumnId()));
        } else {
            throw new AppException(ErrorCode.INVALID_OBJECT_ID);
        }
        Board board = boardRepository.findById(request.getBoardId().toString()).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND));
        Column column = columnRepository.findById(request.getColumnId().toString()).orElseThrow(() -> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        Card savedCard = cardRepository.save(card);
        column.getCardOrderIds().add(savedCard.getCardId());
        columnRepository.save(column);
        CardResponse cardResponse = cardMapper.toCardResponse(savedCard) ;
        cardResponse.setBoardId(card.getBoardId().toString());
        cardResponse.setColumnId(card.getColumnId().toString());
        return cardResponse ;
    }

    public CardResponse getCardById(String id){
        Optional<Card> card = cardRepository.findById(id);
        return cardMapper.toCardResponse(card.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND))) ;
    }
}
