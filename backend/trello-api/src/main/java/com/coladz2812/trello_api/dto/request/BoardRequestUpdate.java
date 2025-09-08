package com.coladz2812.trello_api.dto.request;

import com.coladz2812.trello_api.validator.ScopeConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class BoardRequestUpdate {
    @NotNull(message = "UPDATE_COLUMNORDERIDS_NOT_NULL")
    List<String> columnOrderIds;

}
