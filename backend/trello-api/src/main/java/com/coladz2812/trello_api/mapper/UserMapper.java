package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.request.UserRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.dto.response.UserResponse;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true) // bỏ qua ObjectId
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    User toUser(UserRequest request);

    @Mapping(target = "id", ignore = true)
    UserResponse toUserResponse(User user);
}
