package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends MongoRepository<Student,Integer> {

}
