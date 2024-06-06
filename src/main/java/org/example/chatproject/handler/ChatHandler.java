package org.example.chatproject.handler;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Log4j2
public class ChatHandler extends TextWebSocketHandler {

    private static Map<String, List<WebSocketSession>> roomSessions = new HashMap<>();
    private static Map<WebSocketSession, String> sessionUsernames = new HashMap<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload : " + payload);

        String roomId = session.getUri().getPath().split("/")[3];
        List<WebSocketSession> sessions = roomSessions.getOrDefault(roomId, new ArrayList<>());

        for (WebSocketSession sess : sessions) {
            sess.sendMessage(message);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String roomId = session.getUri().getPath().split("/")[3];
        String username = session.getUri().getQuery().split("=")[1];

        List<WebSocketSession> sessions = roomSessions.getOrDefault(roomId, new ArrayList<>());
        for (WebSocketSession sess : sessions) {
            if (sessionUsernames.get(sess).equals(username)) {
                session.sendMessage(new TextMessage("해당 닉네임은 사용되고 있습니다."));
                session.close(CloseStatus.BAD_DATA);
                return;
            }
        }

        sessions.add(session);
        roomSessions.put(roomId, sessions);
        sessionUsernames.put(session, username);

        log.info(session + " 클라이언트 접속");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String roomId = session.getUri().getPath().split("/")[3];
        List<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                roomSessions.remove(roomId);
            }
        }
        sessionUsernames.remove(session);

        log.info(session + " 클라이언트 접속 해제");
    }
}



