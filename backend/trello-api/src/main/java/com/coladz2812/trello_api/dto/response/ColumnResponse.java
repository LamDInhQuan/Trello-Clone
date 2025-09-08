package com.coladz2812.trello_api.dto.response;

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
public class ColumnResponse {
    String columnId ;
    String boardId ;
    String title;
    List<String> cardOrderIds ;
    Date createdAt ;
    Date updatedAt;
    Boolean _destroy ;
}
