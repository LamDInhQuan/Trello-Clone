package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.Column;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ColumnRepository extends MongoRepository<Column , String> {
}
