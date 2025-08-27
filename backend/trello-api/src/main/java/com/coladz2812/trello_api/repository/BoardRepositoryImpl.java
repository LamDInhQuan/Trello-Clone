package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.model.Board;
import com.fasterxml.jackson.databind.deser.impl.ObjectIdReader;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.aggregation.VariableOperators.Let;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


// cách đặt tên lớp class custom
// Vì Spring Boot mặc định sẽ tìm class có tên [InterfaceName]Impl, ví dụ:
// Interface: BoardRepositoryCustom
// Class: BoardRepositoryCustomImpl (hoặc BoardRepositoryImpl nếu bạn chỉ có một interface custom)
@Slf4j
@Repository
public class BoardRepositoryImpl implements BoardRepositoryCustom {
    //  MongoTemplate là gì?
    //  MongoTemplate là class trung tâm trong Spring Data MongoDB để:
    //  Thực hiện truy vấn tùy biến: Query, Aggregation, Update, v.v.
    //  Không cần dựa vào auto-generated method như findById(), save() trong MongoRepository.
    @Autowired
    MongoTemplate mongoTemplate;

    // Aggregation Pipeline:
    //Là một chuỗi các giai đoạn (stages) mà dữ liệu sẽ đi qua. Mỗi giai đoạn thực
    // hiện một phép toán cụ thể trên dữ liệu, và kết quả của giai đoạn trước sẽ được
    // truyền sang giai đoạn sau.
    //Các giai đoạn (Stages):
    //Có nhiều giai đoạn khác nhau trong một pipeline, mỗi giai đoạn thực hiện một chức
    // năng cụ thể, ví dụ:

    //$match: Lọc dữ liệu dựa trên một điều kiện.
    //$group: Nhóm các document lại với nhau và thực hiện các phép toán trên từng nhóm.
    //$sort: Sắp xếp dữ liệu.
    //$project: Chọn các trường cần thiết và thay đổi cấu trúc của document.
    //$unwind: Tách một mảng thành nhiều document.
    @Override
    public List<Board> findBoardByScope(String scope, String title) {
        // 1st : Là stage $match trong aggregation pipeline. Được tạo từ một Criteria.
        log.error("title : " + title);
        MatchOperation matchOperation = Aggregation.match(Criteria.where("scope").is(scope).and("title").regex(".*" + title + ".*", "i"));

        // Aggregation Là pipeline tổng chứa nhiều stages (match, group, sort, limit, v.v.)
        //Được tạo bằng Aggregation.newAggregation(...)
        Aggregation aggregation = Aggregation.newAggregation(matchOperation);

        // AggregationResults<Document> là đối tượng chứa danh sách document kết quả.
        AggregationResults<Board> aggregationResults = mongoTemplate.aggregate(aggregation, "board", Board.class);
        return aggregationResults.getMappedResults();
    }

    // lấy danh sách board và student có trong board
    @Override
    public List<Document> getListBoardAndStudentInBoard() {
        // lọc dữ liệu

        // join 2 bảng
        LookupOperation lookupOperation = Aggregation.lookup("student", "_id", "boardId", "board_Student");
        // Lấy các trường quan trọng
        ProjectionOperation projectionOperation = Aggregation.project("_id", "title", "scope", "columnOrderIds", "board_Student");

        // tạo đường ống
        Aggregation aggregation = Aggregation.newAggregation(lookupOperation, projectionOperation);

        // lấy kết quả
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "board", Document.class);

        return aggregationResults.getMappedResults();
    }

    @Override
    public Document getBoardAndColumnByIdBoard(String id) {
        // tạo pipeline trực tiếp bằng Document
        // Khi bạn viết "$fieldName" (ví dụ "$name" hay "$columns._id"), dấu $ trước tên field
        // có nghĩa là “lấy giá trị của field đó trong document hiện tại”.
        List<Document> pipeline = Arrays.asList(
                // nối điều kiện id board
                new Document("$match", new Document("_id", new ObjectId(id))),
                // join bảng board với column
                new Document("$lookup", new Document()
                        .append("from", "column")
                        .append("localField", "_id")
                        .append("foreignField", "boardId")
                        .append("as", "columns")
                ),
                // phân rã obj ra để nối với bảng card
                // path chỉ định mảng nào trong document bạn muốn tách.
                new Document("$unwind", new Document("path", "$columns")
                        .append("preserveNullAndEmptyArrays", true)),
                // Nếu dùng preserveNullAndEmptyArrays: true cho $unwind, board vẫn tồn tại →
                // $group tạo mảng columns gồm null hoặc mảng rỗng.

                // thực hiện join các obj đã tách lẻ với bảng card
                new Document("$lookup", new Document()
                        .append("from", "card")
                        // tạo biến ảo columns
                        .append("let", new Document("columnId", "$columns._id"))
                        .append("pipeline", Arrays.asList( // một đường ống có thể là một mảng ( match , lookup ,... )
                                        new Document("$match", new Document("$expr",
                                                // $eq luôn nhận một array 2 phần tử: [giá trị1, giá trị2]
                                                // $$columnId là của biến let , $columnId là của bảng card
                                                new Document("$eq", Arrays.asList("$$columnId", "$columnId"))
                                        )
                                        )
                                )
                        )
                        .append("as", "columns.cards") // lưu cards trong columns
                ),
                // group laị các dòng column theo boardID để về obj board
                new Document("$group", new Document()
                        .append("_id", "$_id")
                        .append("title", new Document("$first", "$title"))
                        .append("columns", new Document("$push", new Document("$cond",
                                // $cond: [ <condition>, <then>, <else> ] trong $push là một mảng 3 phần tử:
                                Arrays.asList(
                                        // $ifNull → trả _id nếu có, trả false nếu không có , so sánh
                                        // mảng 2 giá trị là id hoặc false
                                        new Document("$ifNull", Arrays.asList("$columns._id", false)),
                                        "$columns",  // nếu điều kiện đúng → push column này
                                        "$$REMOVE"   // nếu điều kiện sai → bỏ, không push
                                )
                        )))
                        .append("columnOrderIds", new Document("$first", "$columnOrderIds"))
                        .append("scope", new Document("$first", "$scope"))
                )
        );
        // chạy aggregation
        List<Document> results = mongoTemplate.getCollection("board")
                .aggregate(pipeline)
                .into(new ArrayList<>());

        if (results.isEmpty()) {
            throw new AppException(ErrorCode.BOARD_NOT_FOUND);
        }

        Document document = results.get(0);

        // chuyển ObjectId sang String cho board
        ObjectId boardId = (ObjectId) document.get("_id");
        document.put("_id", boardId.toString());

        // parse ObjectId cho columns và cards
        List<Document> columns = (List<Document>) document.get("columns");
        for (Document col : columns) {
            if (col.containsKey("_id")) {
                col.put("_id", col.getObjectId("_id").toString());
            }
            if (col.containsKey("boardId")) {
                col.put("boardId", col.getObjectId("boardId").toString());
            }
            List<Document> cards = (List<Document>) col.get("cards");
            for (Document card : cards) {
                if (card.containsKey("_id")) {
                    card.put("_id", card.getObjectId("_id").toString());
                }
                if (card.containsKey("boardId")) {
                    card.put("boardId", card.getObjectId("boardId").toString());
                }
                if (card.containsKey("columnId")) {
                    card.put("columnId", card.getObjectId("columnId").toString());
                }
            }
            document.put("cards", cards);
        }
        document.put("columns", columns);

        return document;
    }

    // Trong MongoDB, $lookup là stage trong aggregation pipeline dùng để
    // join hai collection lại với nhau, tương tự như JOIN trong SQL.


    // ❌ Không có sẵn (phải viết thủ công):
    //Các toán tử như:
    //
    //$addFields
    //$map
    //$cond
    //$reduce
    //$mergeObjects
    //$filter
    //… không có class đại diện riêng trong Spring Aggregation.
}
// 1️⃣ Stage cơ bản
// Lệnh	    Mục đích	                                         Ví dụ
// $match	Lọc document, tương đương WHERE             	match(eq("_id", new ObjectId(id)))
// $project	Chọn/đổi tên/cộng tính field, tương tự SELECT	project(fields(include("name","columns")))
// $unwind	Phân rã mảng thành từng document	            unwind("$columns")
// $group	Gom document theo _id, tính toán aggregate	    group("$_id", first("name","$name"), push("columns","$columns"))
// $sort	Sắp xếp document	                            sort(Sorts.ascending("name"))
// $limit	Giới hạn số document trả về	                    limit(10)
// $skip	Bỏ qua N document đầu	                        skip(5)
// $count	Đếm document	                                count("total")

// 2️⃣ Stage join / liên kết
// Lệnh	    Mục đích	                                Ví dụ
// $lookup	Join collection khác	                   lookup("column","_id","boardId","columns")
// $lookup + pipeline	Join với điều kiện nâng cao	   lookup("card", Arrays.asList(new Variable<>("columnId","$columns._id")),
//                                                 Arrays.asList(match(expr(eq("$$columnId","$columnId")))), "columns.cards")

// 3️⃣ Operator hay dùng trong $group
//  Operator	Ý nghĩa	                                                 Ví dụ
//  $sum	    Cộng	                                            sum("totalQty","$qty")
//  $avg	    Trung bình	                                        avg("avgScore","$score")
//  $min	    Giá trị nhỏ nhất	                                min("minPrice","$price")
//  $max	    Giá trị lớn nhất	                                max("maxPrice","$price")
//  $first	    Lấy giá trị đầu tiên trong nhóm	                    first("name","$name")
//  $last	    Lấy giá trị cuối cùng	                            last("name","$name")
//  $push	    Gom tất cả thành mảng	                            push("columns","$columns")
//  $addToSet	Gom tất cả thành mảng duy nhất (loại bỏ trùng)	    addToSet("tags","$tag")

// 4️⃣ Operator để thao tác field trong pipeline
//  Operator	                                                            Ý nghĩa
//  $expr	                                                        Cho phép dùng expression trong $match
//  $eq(=) , $gt(>) , $lt(<), $gte(>=), $lte(<=), $ne(!=)	        So sánh
//  $and, $or, $not	                                                Logic
//  $concat, $substr, $toUpper, $toLower	                        Xử lý string
//  $arrayElemAt, $size, $map, $filter	                            Xử lý mảng
//  $$<variable>	                                                Lấy giá trị biến trong $lookup pipeline