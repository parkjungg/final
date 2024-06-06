package org.example.chatproject.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Log4j2
public class ChatController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @PostMapping("/chat")
    public String chat(@RequestParam("username") String username) {
        log.info("Username: " + username);
        return "redirect:/chat?username=" + username;
    }
    ///chat 엔드포인트인 컨트롤러
    @GetMapping("/chat")
    public String chatGET(@RequestParam("username") String username) {
        log.info("@ChatController.chatGET() with username: " + username);
        return "Chat page for " + username;
    }

}

