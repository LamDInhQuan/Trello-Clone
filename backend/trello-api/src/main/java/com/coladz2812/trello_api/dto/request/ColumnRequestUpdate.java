package com.coladz2812.trello_api.dto.request;

import com.coladz2812.trello_api.classValidation.ColumnInfoUpdate;
import com.coladz2812.trello_api.classValidation.SingleColumnUpdate;
import com.coladz2812.trello_api.classValidation.TwoColumnsUpdate;
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

public class ColumnRequestUpdate {
    @NotNull(groups = SingleColumnUpdate.class, message = "UPDATE_CARDORDERIDS_NOT_NULL")
    List<String> cardOrderIds;

    @NotNull(groups = TwoColumnsUpdate.class, message = "CARDID_NOT_NULL")
    String cardId;

    @NotNull(groups = TwoColumnsUpdate.class, message = "COLUMNID_NOT_NULL")
    String prevColumnId;

    @NotNull(groups = TwoColumnsUpdate.class, message = "UPDATE_CARDORDERIDS_NOT_NULL")
    List<String> prevCardOrderIds;

    @NotNull(groups = TwoColumnsUpdate.class, message = "COLUMNID_NOT_NULL")
    String nextColumnId;

    @NotNull(groups = TwoColumnsUpdate.class, message = "UPDATE_CARDORDERIDS_NOT_NULL")
    List<String> nextCardOrderIds;

    @NotNull(groups = ColumnInfoUpdate.class, message = "COLUMNID_NOT_NULL")
    String columnId ;
    @NotNull(groups = ColumnInfoUpdate.class, message = "COLUMN_TITLE_NOT_NULL")
    @Size(min = 3, max = 20, message = "COLUMN_TITLE_CHARACTER",groups = ColumnInfoUpdate.class)
    String title;
}
