package org.example.chatproject.controller;

import lombok.extern.log4j.Log4j2;
import org.example.chatproject.model.ChatRoom;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@Log4j2
@RequestMapping("/rooms")
public class ChatRoomController {
    private List<ChatRoom> chatRooms = new ArrayList<>();

    @GetMapping
    public List<ChatRoom> getChatRooms() {
        return chatRooms;
    }

    @PostMapping
    public ChatRoom createChatRoom(@RequestParam String name) {
        // 동일한 이름의 채팅방이 있는지 검사
        for (ChatRoom room : chatRooms) {
            if (room.getName().equalsIgnoreCase(name)) {
                throw new IllegalArgumentException("해당 채팅방은 이미 존재합니다.");
            }
        }
        String roomId = UUID.randomUUID().toString();
        ChatRoom chatRoom = new ChatRoom(roomId, name);
        chatRooms.add(chatRoom);
        log.info("Chat room created: " + chatRoom);
        return chatRoom;
    }
}
