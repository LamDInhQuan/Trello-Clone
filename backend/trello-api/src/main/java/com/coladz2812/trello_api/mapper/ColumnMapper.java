package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.model.Column;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ColumnMapper {
    @Mapping(target = "boardId", ignore = true) // bỏ qua ObjectId
    Column toColumn(ColumnRequest request);

    @Mapping(target = "boardId", ignore = true)
    ColumnResponse toColumnResponse(Column column);
}
