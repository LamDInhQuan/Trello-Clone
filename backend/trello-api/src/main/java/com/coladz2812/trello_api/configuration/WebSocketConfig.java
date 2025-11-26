package com.coladz2812.trello_api.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.*;

@Configuration
// Kích hoạt WebSocket Message Broker trong Spring. Nghĩa là bật cơ chế STOMP
// (một giao thức chạy trên WebSocket) để gửi/nhận message.
@EnableWebSocketMessageBroker
// WebSocketMessageBrokerConfigurer Là interface cho phép bạn tùy chỉnh cách cấu hình broker, endpoint, prefix… bằng
// cách override các hàm của nó.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // "/ws" Là đường dẫn mà client sẽ “mở” kết nối WebSocket tới.
        //Khi client gọi: const socket = new SockJS('http://localhost:8080/ws')
        //→ Spring Boot nhận kết nối tại /ws, sau đó chuyển sang giao thức STOMP để truyền message.
        registry.addEndpoint("/ws").setAllowedOriginPatterns("http://localhost:3000") // ✅ dùng patterns thay vì origins
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue"); // queue để gửi riêng user , topic gửi all
        // Bật simple message broker nội bộ của Spring.
        //→ Các message có đích (destination) bắt đầu bằng /topic sẽ được broker xử lý và broadcast tới client.
        registry.setApplicationDestinationPrefixes("/app");
        //Đặt prefix cho các message từ client gửi lên server.
        //→ Khi client gửi tới /app/xxx, Spring sẽ điều hướng tới các hàm có @MessageMapping("/xxx").
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                // System.out.println("📡 [WebSocket INBOUND] " + message);
                return message;
            }
        });
    }

    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                // System.out.println("📡 [WebSocket OUTBOUND] " + message);
                return message;
            }
        });
    }
}
