package com.example.Wararepo_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CreateLiveController {

    @GetMapping("/create-live")
    public String createLive(Model model) {
        return "create-live";
    }
}
