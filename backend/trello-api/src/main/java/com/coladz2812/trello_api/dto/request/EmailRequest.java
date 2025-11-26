package com.coladz2812.trello_api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class EmailRequest {
    @NotBlank(message = "EMAIL_NOT_NULL")
    @Email(message = "EMAIL_NOT_VALID")
    String to;

    @NotBlank(message = "SUBJECT_EMAIL_NOT_NULL")
    String subject;

    @NotBlank(message = "CONTENT_EMAIL_NOT_NULL")
    String content;

}
