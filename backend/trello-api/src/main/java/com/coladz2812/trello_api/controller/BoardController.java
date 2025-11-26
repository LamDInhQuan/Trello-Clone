package com.coladz2812.trello_api.controller;

import com.coladz2812.trello_api.dto.request.BoardRequest;
import com.coladz2812.trello_api.dto.request.BoardRequestUpdate;
import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.filter.RequestContext;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.service.BoardService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Slf4j
@RequestMapping("/board")
@RestController
@RequiredArgsConstructor // dùng thay autowired để tự tạo constructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // field final mới dùng dc NoArgsConstructor
// public UserService(UserRepository userRepository) {
//    this.userRepository = userRepository; }
public class BoardController {
    BoardService boardService;
//    RequestContext requestContext;

    @PostMapping("/create")
    public ApiResponse<BoardResponse> createNewBoard(@RequestBody @Valid BoardRequest request, Authentication authentication) {
        var boardResponse = boardService.createNewBoard(request, authentication.getPrincipal().toString());
        ApiResponse<BoardResponse> apiResponse = ApiResponse.<BoardResponse>builder().result(boardResponse).build();
        return apiResponse;
    }

    @GetMapping("/getListBoards")
    public ApiResponse<List<Document>> getListBoards(Authentication authentication, @RequestParam("page") int currentPage) {
        var boardResponse = boardService.getListBoards(authentication.getPrincipal().toString(), currentPage);
        ApiResponse<List<Document>> apiResponse = ApiResponse.<List<Document>>builder().result(boardResponse).build();
        return apiResponse;
    }

    @GetMapping("/findListBoards")
    public ApiResponse<List<Document>> findListBoards(Authentication authentication,
                                                           @RequestParam Map<String, String> allSearchParams) {
        // log.error("allSearchParams" + allSearchParams);
        Map<String, String> searchObject = allSearchParams.entrySet().stream().filter(item -> item.getKey().startsWith("q["))
                .collect(Collectors.toMap(item -> item.getKey().toString().substring(2, item.getKey().toString().length() - 1), Map.Entry::getValue));
        // log.error("searchObject" + searchObject);
        var boardResponse = boardService.findListBoards(authentication.getPrincipal().toString(),searchObject);
        ApiResponse<List<Document>> apiResponse = ApiResponse.<List<Document>>builder().result(boardResponse).build();
        return apiResponse;
    }

    @GetMapping("/getBoardById/{id}")
    public ApiResponse<BoardResponse> getBoardById(@PathVariable String id) {
        var boardResponse = boardService.getBoardById(id);
        ApiResponse<BoardResponse> apiResponse = ApiResponse.<BoardResponse>builder().result(boardResponse).build();
        return apiResponse;
    }

    @GetMapping("/getBoardByScope/{scope}")
    public ApiResponse<List<BoardResponse>> getBoardByScope(@RequestParam String scope, @RequestParam String title) {
        List<BoardResponse> boardResponses = boardService.getBoardByScope(scope, title);
        ApiResponse<List<BoardResponse>> apiResponse = ApiResponse.<List<BoardResponse>>builder().result(boardResponses).build();
        return apiResponse;
    }


    @GetMapping("/getBoardAndColumnByIdBoard/{id}")
    public ApiResponse<Document> getListBoardAndColumn(Authentication authentication, @PathVariable String id) {
        log.error("get board ");
        Document boardResponse = boardService.getBoardAndColumnByIdBoard(id, authentication.getPrincipal().toString());
        ApiResponse<Document> apiResponse = ApiResponse.<Document>builder().result(boardResponse).build();
        return apiResponse;
    }

    @PutMapping("/updateBoardByColumnIds/{id}")
    public ApiResponse<BoardResponse> updateBoardByColumnIds(@PathVariable String id, @Valid @RequestBody BoardRequestUpdate request) {
        var boardResponse = boardService.updateBoardByColumnIds(id, request);
        ApiResponse<BoardResponse> apiResponse = ApiResponse.<BoardResponse>builder().result(boardResponse).build();
        return apiResponse;
    }

    @DeleteMapping("/deleteColumn/{boardId}/column/{columnId}")
    public ApiResponse<String> updateColumnByCardOrderIdsInTheSameColumn(@PathVariable String boardId, @PathVariable String columnId) {
        String response = boardService.deleteOneColumnInBoard(boardId, columnId);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder().result(response).build();
        return apiResponse;
    }

}
