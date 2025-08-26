package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.model.Column;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColumnMapper {
    Column toColumn(ColumnRequest request);

    ColumnResponse toColumnResponse(Column column);
}
