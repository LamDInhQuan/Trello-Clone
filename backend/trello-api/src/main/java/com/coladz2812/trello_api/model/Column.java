package com.coladz2812.trello_api.model;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Column {
    @Id
    String columnId ;
    ObjectId boardId ;
    String title ;
    List<String> cardOrderIds = List.of() ;
    Date createAt = new Date();
    Date updateAt ;
    Boolean _destroy = false ;
}
