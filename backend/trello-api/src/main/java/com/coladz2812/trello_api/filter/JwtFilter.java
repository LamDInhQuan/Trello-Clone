package com.coladz2812.trello_api.filter;

import com.coladz2812.trello_api.configuration.CustomJwtDecoder;
import com.coladz2812.trello_api.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE , makeFinal = true)
@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    CustomJwtDecoder customJwtDecoder;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        String accesToken = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("accesToken")) {
                    accesToken = cookie.getValue();
                    log.error("Cookie value: " + cookie.getValue());
                }
            }
        }
        if (!accesToken.equals("")) {

            log.error("accesToken : " + accesToken);
            var jwt = customJwtDecoder.decode(accesToken);
            jwt.getClaims().forEach((u , v) -> {
                log.error("key : "+u+" valye :"+v);
            });

            // Đây là một implementation của Authentication trong Spring Security, đại diện cho thông tin đăng nhập của user.
            //  principal: thông tin user, thường là UserDetails hoặc username.
            //  credentials: password hoặc null nếu đã xác thực.
            //  authorities: danh sách quyền hạn (ROLE_USER, ROLE_ADMIN).
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(null,null,null);

            // SecurityContextHolder Là lớp trung tâm trong Spring Security, dùng để lưu trữ thông tin bảo mật của request hiện tại.
            // Nói cách khác, đây là nơi Spring Security biết request này đã đăng nhập chưa, user nào, quyền gì.
            // khi token hợp lệ và decode thành công thì phải cho authentication thì mới truy cập dc API
            SecurityContextHolder.getContext().setAuthentication(token);



        }
        // Nếu hợp lệ -> cho đi tiếp
        filterChain.doFilter(request, response);
    }
}
