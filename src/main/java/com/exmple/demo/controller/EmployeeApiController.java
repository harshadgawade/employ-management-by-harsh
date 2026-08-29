package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // React Frontend access allow karega
public class EmployeeApiController {

    private final EmployeeRepository repository;

    public EmployeeApiController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // React App ke liye database se saare employees fetch karega (JSON format)
    @GetMapping("/employees")
    public List<Employee> getAllEmployeesForReact() {
        return repository.findAll();
    }

    // OTP Auth verification endpoint
    @PostMapping("/auth/verify-otp")
    public String verifyOtp(@RequestBody String body) {
        return "{\"success\": true, \"token\": \"jwt-session-token-xyz\"}";
    }
}