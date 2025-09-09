package com.coladz2812.trello_api.service;

import com.coladz2812.trello_api.dto.request.BoardRequest;
import com.coladz2812.trello_api.dto.request.BoardRequestUpdate;
import com.coladz2812.trello_api.dto.request.ColumnRequestUpdate;
import com.coladz2812.trello_api.dto.response.BoardResponse;
import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.coladz2812.trello_api.mapper.BoardMapper;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Column;
import com.coladz2812.trello_api.repository.BoardRepository;
import com.coladz2812.trello_api.repository.CardRepository;
import com.coladz2812.trello_api.repository.ColumnRepository;
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
    private final CardRepository cardRepository;
    private final ColumnRepository columnRepository;
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

    public String deleteOneColumnInBoard(String boardId ,String columnId) {
        Board board = boardRepository.findById(boardId).orElseThrow(()-> new AppException(ErrorCode.BOARD_NOT_FOUND));
        Column column = columnRepository.findById(columnId).orElseThrow(()-> new AppException(ErrorCode.COLUMN_NOT_FOUND));
        board.getColumnOrderIds().remove(columnId);
        boardRepository.save(board); // rất quan trọng
        if(board.getColumnOrderIds().contains(column.getColumnId())){
            throw new AppException(ErrorCode.REMOVE_COLUMN_FAILED);
        }
        columnRepository.delete(column);
        cardRepository.deleteAllById(column.getCardOrderIds());
        // Kiểm tra còn tồn tại không
        List<String> cards = column.getCardOrderIds();
        boolean existsColumnInColumn = columnRepository.existsById(columnId);
        boolean existsCards = cards.stream().allMatch(item -> cardRepository.existsById(item));
        log.error("existsColumnInColumn "+existsColumnInColumn);
        log.error("existsCards "+existsCards);
        if (existsColumnInColumn && existsCards) {
            throw new AppException(ErrorCode.REMOVE_COLUMN_FAILED);
        }
        return "Xóa column thành công";
    }
}
