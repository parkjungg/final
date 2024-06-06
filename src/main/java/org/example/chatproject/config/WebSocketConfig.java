package org.example.chatproject.config;

import lombok.RequiredArgsConstructor;
import org.example.chatproject.handler.ChatHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket //웹소켓을 활성화
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    private final ChatHandler chatHandler;
    //특정 endpoint 를 정의 한 뒤, 도메인이 다른 서버에서도 접속 가능 하도록 모든 가능성을 열어둔다(보안성 취약함)
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatHandler, "/ws/chat/{roomId}").setAllowedOrigins("*");
    }
}
