package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.InvalidatedToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvalidatedTokenRepository extends MongoRepository <InvalidatedToken,String> {
}
