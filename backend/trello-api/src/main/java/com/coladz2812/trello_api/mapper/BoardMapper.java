package com.coladz2812.trello_api.mapper;

import com.coladz2812.trello_api.dto.request.BoardRequest;
import com.coladz2812.trello_api.dto.request.StudentRequest;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.model.Board;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

// toXxx()	Chuyển đổi giữa Entity và DTO
@Mapper(componentModel = "spring")
public interface BoardMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "_destroy", ignore = true)
    Board toBoard(BoardRequest request);

    BoardResponse toBoardResponse(Board board);

    List<BoardResponse> toListBoardResponse(List<Board> boards);
}
