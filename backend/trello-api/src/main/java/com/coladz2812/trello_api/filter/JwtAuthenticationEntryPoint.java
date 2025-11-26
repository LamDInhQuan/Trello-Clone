package com.coladz2812.trello_api.filter;

import com.coladz2812.trello_api.dto.response.ApiResponse;
import com.coladz2812.trello_api.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.util.Arrays;

@Slf4j
// AuthenticationEntryPoint là gì?
// Nó là một callback mà Spring gọi khi ExceptionTranslationFilter bắt được lỗi authentication.
//  Nghĩa là nó không nằm trong chain theo nghĩa "filter chạy tuần tự", mà là “điểm thoát” khi lỗi xảy ra.
//  Nó là một interface trong Spring Security.
//  Vai trò: xử lý ngoại lệ liên quan đến Authentication (chưa đăng nhập / token sai / hết hạn).
//  Khi Spring Security thấy request không có hoặc token không hợp lệ, nó sẽ gọi thẳng AuthenticationEntryPoint
//  thay vì ném exception lung tung.
//  Hiểu nôm na: 👉 Đây là cổng vào mặc định cho request chưa xác thực. Nếu request fail ở bước xác thực → nó sẽ
//  gọi AuthenticationEntryPoint để bạn tự custom response (JSON, redirect, v.v.).

    public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // commence() chính là nơi trả về phản hồi lỗi 401 Unauthorized.
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // lấy attrr set ở request để lấy lỗi expired hoặc authenticated từ jwtfilter
        Object errorCodeAttr = request.getAttribute("authErrorCode");
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;

        if (errorCodeAttr instanceof ErrorCode) {
            errorCode = (ErrorCode) errorCodeAttr;
        }
        ApiResponse apiResponse = new ApiResponse().builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessageCode())
                .build();
        response.setStatus(errorCode.getHttpStatusCode().value());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        ObjectMapper objectMapper = new ObjectMapper(); // viết thành json
        objectMapper.writeValue(response.getWriter(),apiResponse);
        response.flushBuffer();
    }
}
