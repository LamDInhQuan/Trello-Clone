package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.model.Column;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ColumnMapper {
    @Mapping(target = "boardId", ignore = true) // bỏ qua ObjectId
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    @Mapping(target = "_destroy", ignore = true)
    Column toColumn(ColumnRequest request);

    @Mapping(target = "boardId", ignore = true)
    ColumnResponse toColumnResponse(Column column);
}
