package com.coladz2812.trello_api.filter;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@Data
@NoArgsConstructor
@RequestScope // tạo obj dc truyền từ requestdata
// mỗi HTTP request được tạo một instance riêng
public class RequestContext {
    private Object requestContext ;

}