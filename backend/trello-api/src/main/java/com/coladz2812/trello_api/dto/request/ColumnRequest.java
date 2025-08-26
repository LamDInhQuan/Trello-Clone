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
public class ColumnRequest {
    String columnId ;
    ObjectId boardId ;
    @Size(min = 3, max = 20, message = "COLUMN_TITLE_CHARACTER")
    String title;
    List<String> cardOrderIds;
    Date createdAt;
    Date updatedAt;
    Boolean _destroy;
}
