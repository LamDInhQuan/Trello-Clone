package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.Board;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepositoryCustom {
    public List<Board> findBoardByScope(String scope,String title);

//    public List<Document> getListBoardAndStudentInBoard();

    public Document getBoardAndColumnByIdBoard(String id);
}
