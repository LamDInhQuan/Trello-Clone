package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.dto.response.CardResponse;
import com.coladz2812.trello_api.model.Board;
import com.coladz2812.trello_api.model.Card;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepositoryCustom{
    public Card findCardDetailById(String cardId , String userId);

}
