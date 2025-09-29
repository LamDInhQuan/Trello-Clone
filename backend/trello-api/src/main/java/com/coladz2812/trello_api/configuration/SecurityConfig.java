package com.coladz2812.trello_api.configuration;

import com.coladz2812.trello_api.filter.JwtFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE , makeFinal = true)
@Slf4j
@Configuration
public class SecurityConfig { // lớp này xử lí request trước khi đi vào controllẻr
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    final JwtFilter jwtFilter ;

    //  HttpSecurity Nó là một builder (giống như StringBuilder) do Spring Security cung cấp.
    //  Dùng để cấu hình chuỗi filter (filter chain) mà Spring Security sẽ áp dụng cho mọi request HTTP.
    //  Thay vì bạn phải tự add filter thủ công, Spring cung cấp HttpSecurity để bạn viết “DSL” (Domain Specific Language).

    //  2. SecurityFilterChain là gì?
    //  Đây là một bean mà bạn khai báo trong Spring.
    //  Nó đại diện cho toàn bộ chuỗi filter (filter chain) mà Spring Security sẽ áp dụng cho request.

    private static final String[] PUBLIC_ENDPOINT = {"/user/**"};

    // CSRF = Cross-Site Request Forgery (tấn công giả mạo yêu cầu từ trình duyệt).
    //  Tấn công: hacker gửi 1 form/post từ website độc hại, khi bạn đang đăng nhập ở site hợp lệ thì request sẽ dùng cookie session
    //  của bạn để thao tác (ví dụ chuyển tiền, đổi mật khẩu).
    //  Spring Security bật CSRF protection mặc định cho ứng dụng web dùng session/cookie login.
    //  Nhưng với REST API (JWT, token-based, stateless) → thường tắt CSRF vì request không dựa vào cookie.

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity ) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(request ->
                        request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINT)
                        .permitAll().anyRequest().authenticated());

        httpSecurity.addFilterAfter(jwtFilter, CorsFilter.class);
        //        // Bật chế độ resource server. Spring sẽ thêm filter chuyên xử lý token (BearerTokenAuthenticationFilter).
        //        httpSecurity.oauth2ResourceServer(oauth2 -> {
        //            oauth2.jwt(jwtConfigurer-> {
        //                jwtConfigurer.decoder();
        //            })
        //        })
        return httpSecurity.build();
    }


}
