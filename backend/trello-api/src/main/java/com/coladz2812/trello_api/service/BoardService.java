package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.BoardRequest;
import com.coladz2812.trello_api.dto.request.BoardRequestUpdate;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.BoardMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.github.slugify.Slugify;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class BoardService {
    BoardRepository boardRepository ;
    BoardMapper boardMapper ;
    Slugify slugify ;

    public BoardResponse createNewBoard(BoardRequest request){
        Board board = boardMapper.toBoard(request) ;
        board.setSlug(slugify.slugify(board.getTitle()));
        return boardMapper.toBoardResponse(boardRepository.save(board));
    }

    public BoardResponse getBoardById(String id){
        Optional<Board> board = boardRepository.findById(id);
        return boardMapper.toBoardResponse(board.orElseThrow(()-> new AppException(ErrorCode.BOARD_NOT_FOUND)));
    }

    public List<BoardResponse> getBoardByScope(String scope,String title){
        List<Board> boards = boardRepository.findBoardByScope(scope,title);
        if(boards.isEmpty()){
            throw new AppException(ErrorCode.BOARD_NOT_FOUND);
        }
        return boardMapper.toListBoardResponse(boards);
    }

    public List<Document> getListBoardAndStudentInBoard(){
        return boardRepository.getListBoardAndStudentInBoard();
    }

    public Document getBoardAndColumnByIdBoard(String id){
        Document document =  boardRepository.getBoardAndColumnByIdBoard(id);
        log.error("document : "+document.toJson());
        if(document == null || document.isEmpty()){
            throw new AppException(ErrorCode.BOARD_NOT_FOUND);
        }
        return document ;
    }

    public BoardResponse updateBoardByColumnIds(String id , BoardRequestUpdate request) {
        Board board = boardRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.BOARD_NOT_FOUND));
        board.setColumnOrderIds(request.getColumnOrderIds());
        board.setUpdatedAt(new Date());
        return boardMapper.toBoardResponse(boardRepository.save(board));
    }


}
