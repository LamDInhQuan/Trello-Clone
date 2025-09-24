package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User,String> {

    boolean existsByEmail(String email);
}
