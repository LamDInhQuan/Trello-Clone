package com.coladz2812.trello_api.dto.response;

import com.coladz2812.trello_api.model.Comment;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardResponse {
    String cardId ;
    String boardId;
    String columnId;
    String title;
    String cardCover ;
    String description;
    List<String> memberIds;
    List<Comment> comments;
    Date createdAt;
    Date updatedAt;
    Boolean _destroy;

}
