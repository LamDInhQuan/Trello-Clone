package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.ColumnMapper;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.repository.ColumnRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Service
public class ColumnService {

    ColumnRepository columnRepository;
    ColumnMapper columnMapper;

    public ColumnResponse addColumn(ColumnRequest request) {
        Column column = columnMapper.toColumn(request);
        return columnMapper.toColumnResponse(columnRepository.save(column));
    }

    public ColumnResponse getColumnById(String id) {
        Optional<Column> column = columnRepository.findById(id);
        return columnMapper.toColumnResponse(column.orElseThrow(() -> new AppException(ErrorCode.BOARD_NOT_FOUND)));
    }
}
