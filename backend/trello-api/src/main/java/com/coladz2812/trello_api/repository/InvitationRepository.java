package com.coladz2812.trello_api.repository;

import com.coladz2812.trello_api.model.InvalidatedToken;
import com.coladz2812.trello_api.model.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvitationRepository extends MongoRepository<Invitation,String> , InvitationRepositoryCustom {
}
