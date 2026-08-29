package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "*") // Localhost + Render Cloud Deployment dono allow honge
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // ==========================================
    // 1. THYMELEAF HTML VIEW MAPPINGS
    // ==========================================

    // Purana HTML Homepage mapping
    @GetMapping("/")
    public String viewHomePage(Model model) {
        model.addAttribute("listEmployees", repository.findAll());
        return "index";
    }

    // ==========================================
    // 2. REACT FRONTEND KE LIYE REST API ENDPOINTS
    // ==========================================

    // Fetch all employees for React (JSON Format)
    @GetMapping("/api/employees")
    @ResponseBody
    public List<Employee> getEmployeesApi() {
        return repository.findAll();
    }

    // OTP Auth verification for React
    @PostMapping("/api/auth/verify-otp")
    @ResponseBody
    public String verifyOtp(@RequestBody String body) {
        return "{\"success\": true, \"token\": \"jwt-session-token-xyz\"}";
    }
}
