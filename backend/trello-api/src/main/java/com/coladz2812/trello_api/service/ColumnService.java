package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.ColumnMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Card;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.CardRepository;
import com.coladz2812.trello_api.repository.ColumnRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Service
public class ColumnService {

    ColumnRepository columnRepository;
    ColumnMapper columnMapper;


    BoardRepository boardRepository;
    CardRepository cardRepository ;

    // @Transactional là annotation trong Spring dùng để quản lý transaction (giao dịch) cho các thao tác với cơ sở dữ liệu.
    //
    // Nói một cách dễ hiểu: nó đảm bảo rằng tất cả các thao tác trong một phương thức được thực hiện “cùng nhau”.
    // Nếu có bước nào thất bại, toàn bộ các thay đổi trước đó sẽ bị rollback (khôi phục), để database không bị
    // trạng thái “một nửa”.
    @Transactional
    public ColumnResponse addColumn(ColumnRequest request) {
        Column column = columnMapper.toColumn(request);

        // tự xử lý ID
        if (ObjectId.isValid(request.getBoardId())) {
            column.setBoardId(new ObjectId(request.getBoardId()));
        } else {
            throw new AppException(ErrorCode.INVALID_OBJECT_ID);
        }
        Board board = boardRepository.findById(request.getBoardId().toString()).orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND));
        Column savedColumn = columnRepository.save(column);
        board.getColumnOrderIds().add(savedColumn.getColumnId());
        boardRepository.save(board);
        ColumnResponse columnResponse = columnMapper.toColumnResponse(savedColumn) ;
        columnResponse.setBoardId(column.getBoardId().toString());
        columnResponse.setCreatedAt(new Date());
        return columnResponse ;
    }

    public ColumnResponse getColumnById(String id) {
        Optional<Column> column = columnRepository.findById(id);
        return columnMapper.toColumnResponse(column.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND)));
    }
    public ColumnResponse updateColumnByCardOrderIdsInTheSameColumn(String columnId , ColumnRequestUpdate request) {
        Column column = columnRepository.findById(columnId).orElseThrow(()-> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        column.setCardOrderIds(request.getCardOrderIds());
        column.setUpdateAt(new Date());
        return columnMapper.toColumnResponse(columnRepository.save(column));
    }

    public ColumnResponse updateTwoColumnsByCardOrderIds(String columnId , ColumnRequestUpdate request) {
        Column column = columnRepository.findById(columnId).orElseThrow(()-> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        column.setCardOrderIds(request.getCardOrderIds());
        column.setUpdateAt(new Date());
        return columnMapper.toColumnResponse(columnRepository.save(column));
    }

    public Object updateCardOrderIdsInTwoColumn(ColumnRequestUpdate request) {
        Card card = cardRepository.findById(request.getCardId()).orElseThrow(()-> new AppException(ErrorCode.CARD_NOT_FOUND));
        Column prevColumn = columnRepository.findById(request.getPrevColumnId()).orElseThrow(()-> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        Column nextColumn = columnRepository.findById(request.getNextColumnId()).orElseThrow(()-> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        log.error("prevColumn "+prevColumn.getCardOrderIds().size());
        prevColumn.setCardOrderIds(request.getPrevCardOrderIds());
        prevColumn.setUpdateAt(new Date());
        log.error("prevColumn "+prevColumn.getCardOrderIds().size());
        log.error("nextColumn "+nextColumn.getCardOrderIds().size());
        nextColumn.setCardOrderIds(request.getNextCardOrderIds());
        nextColumn.setUpdateAt(new Date());
        log.error("nextColumn "+nextColumn.getCardOrderIds().size());
        columnRepository.save(prevColumn);
        columnRepository.save(nextColumn);
        card.setColumnId(new ObjectId(request.getNextColumnId()));
        return cardRepository.save(card);
    }

    public ColumnResponse updateTitleColumn(ColumnRequestUpdate request){
        Column column = columnRepository.findById(request.getColumnId()).orElseThrow(()-> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        column.setTitle(request.getTitle());
        ColumnResponse columnResponse = columnMapper.toColumnResponse(columnRepository.save(column)) ;
        columnResponse.setBoardId(column.getBoardId().toString());
        columnResponse.setUpdatedAt(new Date());
        columnResponse.setCreatedAt(column.getCreateAt());
        return columnResponse;
    }
}
