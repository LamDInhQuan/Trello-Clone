package com.coladz2812.trello_api.model;

import jakarta.validation.constraints.Min;
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
public class Board {
    @Id
    String id ;
    String title ;
    String slug ;
    String description ;
    List<String> columnOrderIds = List.of();
    Date createdAt = new Date() ;
    Date updatedAt  ;
    Boolean _destroy = false ;
    String scope ;
    List<String> ownerIds = List.of();
    List<String> memberIds = List.of();
}
