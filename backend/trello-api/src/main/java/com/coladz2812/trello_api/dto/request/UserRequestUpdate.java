package com.coladz2812.trello_api.dto.request;

import com.coladz2812.trello_api.classValidation.SingleColumnUpdate;
import com.coladz2812.trello_api.classValidation.TwoColumnsUpdate;
import com.coladz2812.trello_api.classValidation.UserUpdateInfo;
import com.coladz2812.trello_api.classValidation.UserUpdatePassword;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

// groups trong Bean Validation là gì?
// Khi bạn dùng annotation như @NotNull, @Size, @Email… thì mặc định nó sẽ áp dụng cho tất cả các tình huống validate.
// Nhưng nhiều khi bạn muốn cùng một DTO (ColumnUpdateRequest chẳng hạn) có nhiều bối cảnh validate khác nhau.
//👉 Lúc đó bạn dùng validation groups.

// Mỗi annotation constraint (@NotNull, @Size…) có thuộc tính groups.
// Mặc định: groups = Default.class
// Bạn có thể chỉ định groups = {YourGroup.class} để ràng buộc này chỉ chạy khi validate theo group đó.

public class UserRequestUpdate {
    @NotNull(message = "DISPLAY_NAME_NOT_NULL", groups = {UserUpdateInfo.class})
    String displayName;
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d\\W]{8,256}$", message = "PASSWORD_NOT_VALID", groups = {UserUpdatePassword.class})
    String currentPassword;
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d\\W]{8,256}$", message = "PASSWORD_NOT_VALID", groups = {UserUpdatePassword.class})
    String newPassword;
}
