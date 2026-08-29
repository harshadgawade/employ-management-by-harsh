package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:5173") // React access permit
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // Purana HTML Homepage mapping
    @GetMapping("/")
    public String viewHomePage(Model model) {
        model.addAttribute("listEmployees", repository.findAll());
        return "index";
    }

    // ==========================================
    // REACT FRONTEND KE LIYE NAYE API ENDPOINTS
    // ==========================================

    @GetMapping("/api/employees")
    @ResponseBody // Dynamic JSON data render karega (HTML view nahi)
    public List<Employee> getEmployeesApi() {
        return repository.findAll();
    }

    @PostMapping("/api/auth/verify-otp")
    @ResponseBody
    public String verifyOtp(@RequestBody String body) {
        return "{\"success\": true, \"token\": \"jwt-session-token-xyz\"}";
    }
}