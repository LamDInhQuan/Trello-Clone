package com.coladz2812.trello_api.repository;

import org.bson.Document;

import java.util.List;

public interface InvitationRepositoryCustom {
    public List<Document> getNotificationsByUserId(String userId);
}
