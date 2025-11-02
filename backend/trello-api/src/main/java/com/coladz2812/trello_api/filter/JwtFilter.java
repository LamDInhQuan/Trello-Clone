package com.coladz2812.trello_api.filter;

import com.coladz2812.trello_api.exception.AppException;
import com.coladz2812.trello_api.exception.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    CustomJwtDecoder customJwtDecoder;
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/user/login",
            "/user/register",
            "/user/verify",
            "/user/verifyToken",
            "/user/verifyTokenRefresh",
            "/user/refresh",
            "/user/logout"

            // có thể thêm /user/verify-email nếu bạn có xác thực email
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        String method = request.getMethod();

        // chỉ bypass POST request với các endpoint public
        return PUBLIC_ENDPOINTS.contains(path) && "POST".equalsIgnoreCase(method);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = extractAccessToken(request);

        // Log toàn bộ URL và method
        // log.error("Request URL: " + request.getRequestURL());
        //log.error("Request Method: " + request.getMethod());
        if (accessToken != null && !accessToken.isBlank()) {

            // log.error("accesToken : " + accessToken);
            try {
                var jwt = customJwtDecoder.decode(accessToken);
                var id = jwt.getClaimAsString("sub");
                var authorities = List.of(); // hoặc lấy ROLE từ claim nếu có
                // Đây là một implementation của Authentication trong Spring Security, đại diện cho thông tin đăng nhập của user.
                //  principal: thông tin user, thường là UserDetails hoặc username.
                //  credentials: password hoặc null nếu đã xác thực.
                //  authorities: danh sách quyền hạn (ROLE_USER, ROLE_ADMIN).
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(id, null, List.of());
                token.setDetails(jwt.getClaimAsString("email")); // set email và ⚠️ setDetails(...) chỉ giữ một giá trị duy nhất
                // SecurityContextHolder Là lớp trung tâm trong Spring Security, dùng để lưu trữ thông tin bảo mật của request hiện tại.
                // Nói cách khác, đây là nơi Spring Security biết request này đã đăng nhập chưa, user nào, quyền gì.
                // khi token hợp lệ và decode thành công thì phải cho authentication thì mới truy cập dc API
                SecurityContextHolder.getContext().setAuthentication(token);
            } catch (AppException e) { // lỗi decode thất bại
                // set atrr cuả request để chạy vào Authentication Entrypoint
                String error = e.getError().name();
                if (error.equals(ErrorCode.TOKEN_IS_EXPIRED.toString())) {
                    log.error(e.getError().name());
                    request.setAttribute("authErrorCode", ErrorCode.TOKEN_IS_EXPIRED);
                } else if (error.equals(ErrorCode.UNAUTHENTICATED.toString())) {
                    log.error(e.getError().name());
                    request.setAttribute("authErrorCode", ErrorCode.UNAUTHENTICATED);
                    throw new AppException(ErrorCode.UNAUTHENTICATED);
                }

            }

        }
        // Nếu hợp lệ -> cho đi tiếp
        filterChain.doFilter(request, response);
    }

    private String extractAccessToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
