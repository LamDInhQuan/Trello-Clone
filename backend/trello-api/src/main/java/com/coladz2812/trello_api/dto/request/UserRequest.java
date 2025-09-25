package com.coladz2812.trello_api.dto.request;

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
public class UserRequest {
    @Id
    String id ;
    @Email(message = "EMAIL_NOT_VALID")
    @NotBlank(message = "EMAIL_NOT_NULL")
    String email ;
    String username ;
    @NotBlank(message = "PASSWORD_NOT_NULL")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d\\W]{8,256}$" , message = "PASSWORD_NOT_VALID")
    String password ;
    String displayName ;
    String avatar ;
    @ValueIn(values = { "admin" , "user"},message = "ROLE_NOT_VALID")
    List<String> roles = List.of("user");;
    Boolean isActive ;
    String verifyToken ;
    Date createAt ;
    Date updateAt ;
}
