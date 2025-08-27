package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.ColumnMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.ColumnRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Service
public class ColumnService {

    ColumnRepository columnRepository;
    ColumnMapper columnMapper;

    BoardRepository boardRepository;

    // @Transactional là annotation trong Spring dùng để quản lý transaction (giao dịch) cho các thao tác với cơ sở dữ liệu.
    //
    //Nói một cách dễ hiểu: nó đảm bảo rằng tất cả các thao tác trong một phương thức được thực hiện “cùng nhau”.
    // Nếu có bước nào thất bại, toàn bộ các thay đổi trước đó sẽ bị rollback (khôi phục), để database không bị
    // trạng thái “một nửa”.
    @Transactional
    public ColumnResponse addColumn(ColumnRequest request) {
        Column column = columnMapper.toColumn(request);
        Board board = boardRepository.findById(request.getBoardId().toString()).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND));
        Column savedColumn = columnRepository.save(column);
        board.getColumnOrderIds().add(savedColumn.getColumnId());
        boardRepository.save(board);
        return columnMapper.toColumnResponse(savedColumn);
    }

    public ColumnResponse getColumnById(String id) {
        Optional<Column> column = columnRepository.findById(id);
        return columnMapper.toColumnResponse(column.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND)));
    }
}
