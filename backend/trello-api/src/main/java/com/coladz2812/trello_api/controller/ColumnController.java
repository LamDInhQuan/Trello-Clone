package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.request.BoardRequestUpdate;
import com.coladz2812.trello_api.dto.request.ColumnRequest;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.dto.response.ColumnResponse;
import com.coladz2812.trello_api.service.ColumnService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/column")
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }
public class ColumnController {

    ColumnService columnService ;

    @PostMapping("/addColumn")
    public ApiResponse<ColumnResponse> addColumn(@RequestBody @Valid  ColumnRequest request){
        var columnResponse = columnService.addColumn(request);
        ApiResponse<ColumnResponse> apiResponse = ApiResponse.<ColumnResponse>builder().result(columnResponse).build();
        return apiResponse ;
    }

    @GetMapping("/getColumnById/{id}")
    public ApiResponse<ColumnResponse> getBoardById(@PathVariable String id) {
        var boardResponse = columnService.getColumnById(id);
        ApiResponse<ColumnResponse> apiResponse = ApiResponse.<ColumnResponse>builder().result(boardResponse).build();
        return apiResponse ;
    }

    @PutMapping("/updateColumnByCardOrderIdsInTheSameColumn/{id}")
    public ApiResponse<ColumnResponse> updateColumnByCardOrderIdsInTheSameColumn(@PathVariable String id , @Valid @RequestBody ColumnRequestUpdate request) {
        var columnResponse = columnService.updateColumnByCardOrderIdsInTheSameColumn(id,request);
        ApiResponse<ColumnResponse> apiResponse = ApiResponse.<ColumnResponse>builder().result(columnResponse).build();
        return apiResponse ;
    }
}
