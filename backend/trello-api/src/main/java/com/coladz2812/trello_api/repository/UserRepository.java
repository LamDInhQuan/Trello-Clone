package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {

    Optional<User> findByEmail(String email);
}
