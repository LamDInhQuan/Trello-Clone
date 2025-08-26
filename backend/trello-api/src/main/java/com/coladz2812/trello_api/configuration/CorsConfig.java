package com.coladz2812.trello_api.configuration;


import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;
import java.util.Optional;

@Slf4j
@Configuration


public class CorsConfig {

    @Value("${app.cors.whitelist}")
    private String whitelist;

    //Là một Servlet Filter do Spring cung cấp (thực thi giao thức CORS) và có nhiệm vụ chặn mọi
    // HTTP request trước khi chúng vào tới controller hay bất kỳ filter nào khác trong filter chain.
    //
    //Khi bạn đăng ký một bean CorsFilter, Spring Boot sẽ tự động gắn nó vào đầu chuỗi
    // xử lý request, đảm bảo mọi request đều được kiểm tra CORS (pre‑flight OPTIONS và actual request).
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(dynamicCorsConfiguration());
    }

    private CorsConfigurationSource dynamicCorsConfiguration() {

        return new CorsConfigurationSource() {
            @Override
            // chỉ CorsConfigurationSource mới cho phép bạn lấy được HttpServletRequest
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                Optional<String> orgin = Optional.ofNullable(request.getHeader("Origin")); // lấy tên localhost , domain
                CorsConfiguration corsConfiguration = new CorsConfiguration();
                // orgins trong list bằng domain Api thì cho phép vượt qua cấu hình Cors

                if (orgin.isEmpty()) { // chấp nhận postman
                    corsConfiguration.addAllowedOriginPattern("*");
                } else if (orgin.get().equals(whitelist)) {
                    corsConfiguration.addAllowedOrigin(orgin.get());
                } else {
                    log.error("Blocked CORS request from origin: {}", orgin.get());
                    return null ;
                }


                corsConfiguration.addAllowedMethod("*");
                corsConfiguration.setAllowCredentials(true);
                return corsConfiguration;
            }
        };
    }
}
