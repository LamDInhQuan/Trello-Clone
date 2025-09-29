//package com.coladz2812.trello_api.configuration;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.session.web.http.CookieSerializer;
//import org.springframework.session.web.http.DefaultCookieSerializer;
//
//@Configuration
//public class CookieConfig {
//    @Bean
//    public CookieSerializer cookieSerializer(){
//        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
//        // Tên cookie session
//        serializer.setCookieName("JSESSIONID");
//
//        // Áp dụng cho toàn bộ ứng dụng
//        serializer.setCookiePath("/");
//
//        // Chỉ server mới đọc được cookie
//        serializer.setUseHttpOnlyCookie(true);
//
//        // Nếu bạn đang chạy HTTPS
//        serializer.setUseSecureCookie(false); // dev local, production=true
//
//        // Không cần SameSite=None nếu frontend cùng origin
//        return serializer;
//    }
//}
