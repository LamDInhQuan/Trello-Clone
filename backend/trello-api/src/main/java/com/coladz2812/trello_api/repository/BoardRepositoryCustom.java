package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.Board;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface BoardRepositoryCustom {
    public List<Board> findBoardByScope(String scope, String title);

    public Document getBoardAndColumnByIdBoard(String boardId, String userId);

    public List<Document> getListBoardsByUserId(String userId, int currentPage);

    public Board getBoardByBoardIdAndUserId(String userId, String boardId);

    public boolean isUserMemeberInBoard(String userId, String userLoginId , String boardId);

    public List<Document> findBoardBySearchParam(String userId, Map<String,String> searchObjects);
}
