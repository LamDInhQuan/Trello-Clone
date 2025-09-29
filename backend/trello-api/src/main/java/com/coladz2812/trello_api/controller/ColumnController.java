package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.classValidation.SingleColumnUpdate;
import com.coladz2812.trello_api.classValidation.TwoColumnsUpdate;
import com.coladz2812.trello_api.dto.request.BoardRequestUpdate;
import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.filter.RequestContext;
import com.coladz2812.trello_api.service.ColumnService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/column")
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }
public class ColumnController {

    ColumnService columnService;
    //    RequestContext requestContext;

    @PostMapping("/addColumn")
    public ApiResponse<ColumnResponse> addColumn(@RequestBody @Valid ColumnRequest request) {
        var columnResponse = columnService.addColumn(request);
        ApiResponse<ColumnResponse> apiResponse = ApiResponse.<ColumnResponse>builder().result(columnResponse).build();
//        log.error("request context : " + requestContext.getRequestContext());
        return apiResponse;
    }

    @GetMapping("/getColumnById/{id}")
    public ApiResponse<ColumnResponse> getBoardById(@PathVariable String id) {
        var boardResponse = columnService.getColumnById(id);
        ApiResponse<ColumnResponse> apiResponse = ApiResponse.<ColumnResponse>builder().result(boardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateColumnByCardOrderIdsInTheSameColumn/{id}")
    public ApiResponse<ColumnResponse> updateColumnByCardOrderIdsInTheSameColumn(@PathVariable String id, @Validated(SingleColumnUpdate.class) @RequestBody ColumnRequestUpdate request) {
        var columnResponse = columnService.updateColumnByCardOrderIdsInTheSameColumn(id, request);
        ApiResponse<ColumnResponse> apiResponse = ApiResponse.<ColumnResponse>builder().result(columnResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateCardOrderIdsInTwoColumn")
    public ApiResponse<Object> updateCardOrderIdsInTwoColumn(@Validated(TwoColumnsUpdate.class) @RequestBody ColumnRequestUpdate request) {
        var columnsResponse = columnService.updateCardOrderIdsInTwoColumn(request);
        ApiResponse<Object> apiResponse = ApiResponse.<Object>builder().result(columnsResponse).build();
        return apiResponse;
    }

}

// @Valid
// Nguồn gốc: từ JSR-303 Bean Validation (javax.validation).
// Chức năng chính: kiểm tra dữ liệu theo annotation (@NotNull, @Size, @Email...) với nhóm mặc định (Default.class).
// Giới hạn: Không hỗ trợ groups → nghĩa là nếu bạn định nghĩa group, thì @Valid sẽ không biết group nào cần chạy,
// chỉ chạy những constraint không gắn group (hoặc group = Default).

// @Validated
// Nguồn gốc: từ Spring Framework (org.springframework.validation.annotation).
// Chức năng chính: giống @Valid, nhưng có thêm hỗ trợ validation groups.
// Mạnh hơn: bạn chỉ định group nào được áp dụng khi validate.