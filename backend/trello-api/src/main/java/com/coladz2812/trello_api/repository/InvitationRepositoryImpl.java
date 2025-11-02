package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.model.Card;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class InvitationRepositoryImpl implements InvitationRepositoryCustom {
    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public List<Document> getNotificationsByUserId(String userId) {
        // tạo pipeline trực tiếp bằng Document
        // Khi bạn viết "$fieldName" (ví dụ "$name" hay "$columns._id"), dấu $ trước tên field
        // có nghĩa là “lấy giá trị của field đó trong document hiện tại”.
        List<Document> pipeline = Arrays.asList(
                new Document("$match", new Document("inviteeId", new ObjectId(userId))),

                // nối điều kiện id user
                new Document("$lookup", new Document()
                        .append("from", "user")
                        .append("localField", "inviterId")
                        .append("foreignField", "_id")
                        .append("as", "inviter")),

                // new Document("$unwind", "$inviter"),
                new Document("$unwind", new Document("path", "$inviter").append("preserveNullAndEmptyArrays", true)),
                // tìm  board
                new Document("$lookup", new Document()
                        .append("from", "board")
                        .append("localField", "boardInvitations.boardId")
                        .append("foreignField", "_id")
                        .append("as", "board")),
                // new Document("$unwind", "$board") // unwind trực tiếp
                new Document("$unwind", new Document("path", "$board").append("preserveNullAndEmptyArrays", true)),

                new Document("$project",
                        new Document().append("inviter.password", 0).append("inviter.roles", 0).append("inviter.isActive", 0)
                                .append("board.columnOrderIds", 0).append("board._destroy", 0))
        );
        // chạy aggregation
        List<Document> results = mongoTemplate.getCollection("invitation")
                .aggregate(pipeline)
                .into(new ArrayList<>());

//        if (results.isEmpty()) {
//            throw new AppException(ErrorCode.CARD_NOT_FOUND);
//        }

        for (Document doc : results) {
            ObjectId objInviterId = (ObjectId) doc.get("inviterId");
            doc.put("inviterId", objInviterId.toString());
            ObjectId objInviteeId = (ObjectId) doc.get("inviteeId");
            doc.put("inviteeId", objInviteeId.toString());
            ObjectId objInvitationId = (ObjectId) doc.get("_id");
            doc.put("_id", objInvitationId.toString());
            // xử lí obj trong obj
            Document objInvitationBoardId = (Document) doc.get("boardInvitations");
            if (objInvitationBoardId != null && objInvitationBoardId.get("boardId") instanceof ObjectId) {
                objInvitationBoardId.put("boardId", objInvitationBoardId.get("boardId").toString());
            }
            Document objBoardId = (Document) doc.get("board");
            if (objBoardId != null && objBoardId.get("_id") instanceof ObjectId) {
                objBoardId.put("_id", objBoardId.get("_id").toString());
            }
            Document objInviter = (Document) doc.get("inviter");
            if (objInviter != null && objInviter.get("_id") instanceof ObjectId) {
                objInviter.put("_id", objInviter.get("_id").toString());
            }
        }
        // chuyển ObjectId sang String cho board

        return results;
    }
}
