package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.model.Card;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Repository
public class CardRepositoryImpl implements CardRepositoryCustom {
    private static final Log log = LogFactory.getLog(CardRepositoryImpl.class);
    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public Card findCardDetailById(String cardId, String userId) {
        // tạo pipeline trực tiếp bằng Document
        // Khi bạn viết "$fieldName" (ví dụ "$name" hay "$columns._id"), dấu $ trước tên field
        // có nghĩa là “lấy giá trị của field đó trong document hiện tại”.
        List<Document> pipeline = Arrays.asList(
                new Document("$match", new Document("_id", new ObjectId(cardId))),

                // nối điều kiện id board
                new Document("$lookup", new Document()
                        .append("from", "board")
                        .append("localField", "boardId")
                        .append("foreignField", "_id")
                        .append("as", "board")) ,

                // tìm user trong board
                new Document("$match", new Document()
                        .append("$or", Arrays.asList(
                                new Document("board.ownerIds", userId),
                                new Document("board.memberIds", userId)
                        ))
                ) ,
                new Document("$project",
                        new Document().append("board", 0))
        );
        // chạy aggregation
        List<Document> results = mongoTemplate.getCollection("card")
                .aggregate(pipeline)
                .into(new ArrayList<>());

        if (results.isEmpty()) {
            throw new AppException(ErrorCode.CARD_NOT_FOUND_BY_USER_ID);
        }

        Document document = results.get(0);

        // chuyển ObjectId sang String cho board
        ObjectId objboardId = (ObjectId) document.get("boardId");
        document.put("boardId", objboardId.toString());
        ObjectId objcolumnId = (ObjectId) document.get("columnId");
        document.put("columnId", objcolumnId.toString());
        ObjectId objcardId = (ObjectId) document.get("_id");
        document.put("_id", objcardId.toString());
        Card card = mongoTemplate.getConverter().read(Card.class, document);
        log.error(card);
        return card;
    }


    @Override
    public Card findCardDetailByUserIdAndMemberId(String cardId, String userId, String memberId) {
        // tạo pipeline trực tiếp bằng Document
        // Khi bạn viết "$fieldName" (ví dụ "$name" hay "$columns._id"), dấu $ trước tên field
        // có nghĩa là “lấy giá trị của field đó trong document hiện tại”.
        List<Document> pipeline = Arrays.asList(
                new Document("$match", new Document("_id", new ObjectId(cardId))),

                // nối điều kiện id board
                new Document("$lookup", new Document()
                        .append("from", "board")
                        .append("localField", "boardId")
                        .append("foreignField", "_id")
                        .append("as", "board")) ,

                // tìm user trong board
                new Document("$match", new Document()
                        .append("$or", Arrays.asList(
                                new Document("board.ownerIds", userId),
                                new Document("board.memberIds", userId)
                        ))
                ) ,
                new Document("$match", new Document()
                        .append("$or", Arrays.asList(
                                new Document("board.ownerIds", memberId),
                                new Document("board.memberIds", memberId)
                        ))
                ) ,
                new Document("$project",
                        new Document().append("board", 0))
        );
        // chạy aggregation
        List<Document> results = mongoTemplate.getCollection("card")
                .aggregate(pipeline)
                .into(new ArrayList<>());

        if (results.isEmpty()) {
            throw new AppException(ErrorCode.CARD_NOT_FOUND_BY_USER_ID);
        }

        Document document = results.get(0);

        // chuyển ObjectId sang String cho board
        ObjectId objboardId = (ObjectId) document.get("boardId");
        document.put("boardId", objboardId.toString());
        ObjectId objcolumnId = (ObjectId) document.get("columnId");
        document.put("columnId", objcolumnId.toString());
        ObjectId objcardId = (ObjectId) document.get("_id");
        document.put("_id", objcardId.toString());
        Card card = mongoTemplate.getConverter().read(Card.class, document);
        log.error(card);
        return card;
    }
}
