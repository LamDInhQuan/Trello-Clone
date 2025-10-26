package com.coladz2812.trello_api.dto.request;

import com.coladz2812.trello_api.classValidation.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

public class CardRequestUpdate {

    @NotNull(groups = {CardTitleUpdate.class, CardDescriptionUpdate.class}, message = "CARDID_NOT_NULL")
    String cardId;
    @NotNull(groups = CardTitleUpdate.class, message = "CARD_TITLE_NOT_NULL")
    @Size(min = 3, max = 20, message = "CARD_TITLE_CHARACTER", groups = CardTitleUpdate.class)
    String title;
    @NotNull(groups = CardDescriptionUpdate.class, message = "CARD_DESCRIPTION_NOT_NULL")
    @Size(min = 3, max = 1000, message = "CARD_DESCRIPTION_CHARACTER", groups = CardDescriptionUpdate.class)
    String description;
}
