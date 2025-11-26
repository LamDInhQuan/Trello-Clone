package com.coladz2812.trello_api.model;

import lombok.*;
import lombok.experimental.FieldDefaults;


import java.util.Date;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {
    String userId ;
    String userEmail ;
    String userAvatar ;
    String userDisplayname ;
    String content ;
    Date commentAt = new Date() ;
}
