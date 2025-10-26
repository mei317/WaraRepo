package com.example.Wararepo_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CreateSurveyController {

    @GetMapping("/create-survey")
    public String createSurvey(Model model) {
        return "create-survey";
    }
}
