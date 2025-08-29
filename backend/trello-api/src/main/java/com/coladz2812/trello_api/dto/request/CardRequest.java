package com.coladz2812.trello_api.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CardRequest {
    String cardId ;
    String boardId ;
    String columnId ;
    @Size(min = 3, max = 20, message = "CARD_TITLE_CHARACTER")
    String title;
    @Size(min = 3, max = 255, message = "CARD_DESCRIPTION_CHARACTER")
    String description;
    Date createdAt;
    Date updatedAt;
    Boolean _destroy;
}
