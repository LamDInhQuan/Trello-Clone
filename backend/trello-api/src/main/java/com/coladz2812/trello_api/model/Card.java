package com.coladz2812.trello_api.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Card {
    @Id
    String cardId ;
    ObjectId boardId ;
    ObjectId columnId ;
    String title ;
    String description ;
    String cardCover = null;
    List<Comment> comments = List.of();
    Date createdAt = new Date();
    Date updatedAt ;
    Boolean _destroy = false ;
}
