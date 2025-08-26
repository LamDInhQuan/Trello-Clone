package com.coladz2812.trello_api.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class StudentRequest {

    @Id
    Integer rno;
    @Size(min = 3 , max = 20 , message = "STUDENT_NAME_CHARACTER")
    String name;
    @NotBlank(message = "ADDRESS_NOT_BLANK")
    String address;
    String toSlug ;
    String boardId ;
}
