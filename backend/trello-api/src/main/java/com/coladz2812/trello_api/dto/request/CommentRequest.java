package com.coladz2812.trello_api.dto.request;


import com.coladz2812.trello_api.classValidation.CardDescriptionUpdate;
import com.coladz2812.trello_api.classValidation.CardTitleUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    @NotNull(message = "CARDID_NOT_NULL")
    String cardId;

    @NotBlank(message = "CARD_CONTENT_COMMENT_NOT_NULL")
    private String content;
}