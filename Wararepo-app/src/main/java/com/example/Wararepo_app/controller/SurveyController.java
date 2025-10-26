package com.example.Wararepo_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SurveyController {

    @GetMapping("/survey")
    public String survey(Model model) {
        return "survey";
    }
}
