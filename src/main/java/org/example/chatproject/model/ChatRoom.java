package org.example.chatproject.model;

import lombok.Data;

@Data
public class ChatRoom {
    private String roomId;
    private String name;

    public ChatRoom(String roomId, String name) {
        this.roomId = roomId;
        this.name = name;
    }
}
