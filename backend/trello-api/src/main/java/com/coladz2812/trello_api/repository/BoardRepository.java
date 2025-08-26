package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends MongoRepository<Board,String> , BoardRepositoryCustom {

}
