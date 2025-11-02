package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends MongoRepository<Card,String>  ,CardRepositoryCustom    {

}
