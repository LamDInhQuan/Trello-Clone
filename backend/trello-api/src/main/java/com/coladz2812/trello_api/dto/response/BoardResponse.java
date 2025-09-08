package com.coladz2812.trello_api.dto.response;

import com.coladz2812.trello_api.model.Column;
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
public class BoardResponse {
    String id ;
    String title;
    String slug;
    String description;
    List<String> columnOrderIds;
    Date createdAt ;
    Date updatedAt;
    Boolean _destroy ;
    String scope ;

}
