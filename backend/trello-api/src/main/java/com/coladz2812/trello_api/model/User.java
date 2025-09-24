package com.coladz2812.trello_api.model;

import jakarta.validation.Valid;
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
public class User {
    @Id
    String id ;
    String email ;
    String username ;
    String password ;
    String displayName ;
    String avatar ;
    List<String> roles ;
    Boolean isActive = false;
    String verifyToken ;
    Date createAt = new Date();
    Date updateAt ;
}
