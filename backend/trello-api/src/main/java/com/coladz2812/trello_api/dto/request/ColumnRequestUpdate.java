package com.coladz2812.trello_api.dto.request;

import jakarta.validation.constraints.NotNull;
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

public class ColumnRequestUpdate {
    @NotNull(message = "UPDATE_CARDORDERIDS_NOT_NULL")
    List<String> cardOrderIds;

}
