package com.coladz2812.trello_api.dto.response;

import com.coladz2812.trello_api.validator.ValueIn;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id ;
    String email ;
    String username ;
    String password ;
    String displayName ;
    String avatar ;
    List<String> roles ;
    Boolean isActive ;
    String verifyToken ;
    Date createAt ;
    Date updateAt ;
}
