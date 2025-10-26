package com.coladz2812.trello_api.service;

import com.cloudinary.Cloudinary;
import com.coladz2812.trello_api.dto.request.CardRequest;
import com.coladz2812.trello_api.dto.request.CardRequestUpdate;
import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.CardMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Card;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.CardRepository;
import com.coladz2812.trello_api.repository.ColumnRepository;
import com.coladz2812.trello_api.util.FileUploadUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CardService {

    CardRepository cardRepository;
    CardMapper cardMapper;

    ColumnRepository columnRepository;
    BoardRepository boardRepository;
    Cloudinary cloudinary;

    public CardResponse addCard(CardRequest request) {
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
        CardResponse cardResponse = cardMapper.toCardResponse(savedCard);
        cardResponse.setBoardId(card.getBoardId().toString());
        cardResponse.setColumnId(card.getColumnId().toString());
        cardResponse.setCreatedAt(new Date());
        return cardResponse;
    }

    public CardResponse getCardById(String id) {
        Optional<Card> card = cardRepository.findById(id);
        return cardMapper.toCardResponse(card.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND)));
    }

    public CardResponse updateCardInfo(CardRequestUpdate request) {
        Card card = cardRepository.findById(request.getCardId()).orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_FOUND));
//        log.error("card"+card);
        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            card.setTitle(request.getTitle());
            card.setUpdateAt(new Date());
        }
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            card.setDescription(request.getDescription());
            card.setUpdateAt(new Date());
        }
        CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
        cardResponse.setBoardId(card.getBoardId().toString());
        cardResponse.setColumnId(card.getColumnId().toString());
        cardResponse.setCreatedAt(card.getCreateAt());
        cardResponse.setUpdatedAt(card.getUpdateAt());
        return cardResponse;
    }

    public CardResponse uploadCardCover(String cardId, MultipartFile cardCoverFile) {
        Card card = cardRepository.findById(cardId).orElseThrow(() -> new AppException(ErrorCode.CARD_NOT_FOUND));
        log.error("cardCoverFile"+cardId);
        // 2. Update avatar
        if (!cardCoverFile.isEmpty()) {
//            log.error("avatarFile : "+avatarFile);
            try {
                var uploadResponse = cloudinary.uploader().upload(cardCoverFile.getBytes(), Map.of("folder", "cardCovers", // folder trên Cloudinary
                        "public_id", FileUploadUtil.getFileName(cardCoverFile.getOriginalFilename()), // tên file
                        "overwrite", true,
                        "resource_type", "image"));
//                log.error("uploadResponse"+uploadResponse);
                String cardCoverURL = uploadResponse.get("secure_url").toString();
                card.setCardCover(cardCoverURL);
                card.setUpdateAt(new Date());
                CardResponse cardResponse = cardMapper.toCardResponse(cardRepository.save(card));
                cardResponse.setBoardId(card.getBoardId().toString());
                cardResponse.setColumnId(card.getColumnId().toString());
                cardResponse.setCreatedAt(card.getCreateAt());
                cardResponse.setUpdatedAt(card.getUpdateAt());
                return cardResponse ;
            } catch (IOException e) {
                throw new AppException(ErrorCode.UPLOAD_AVATAR_FAILED);
            }

        }
        return null;
    }
}
