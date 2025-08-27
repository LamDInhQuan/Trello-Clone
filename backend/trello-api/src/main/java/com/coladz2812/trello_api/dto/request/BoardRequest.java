package com.coladz2812.trello_api.dto.request;

import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.validator.ScopeConstraint;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class BoardRequest {
    @Size(min = 3, max = 20, message = "BOARD_TITLE_CHARACTER")
    String title;
    @Size(min = 3, message = "BOARD_SLUG_CHARACTER")
    String slug;
    @Size(min = 3, max = 255, message = "BOARD_DESCRIPTION_CHARACTER")
    String description;
    List<String> columnOrderIds;
    Date createdAt;
    Date updatedAt;
    Boolean _destroy;
    @ScopeConstraint(message = "SCOPE_ERROR")
    String scope ;

}
