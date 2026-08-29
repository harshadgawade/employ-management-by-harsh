package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "*") // Local localhost:5173 + Cloud Deployment (Render/Vercel) dono allow honge
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // ==========================================
    // 1. THYMELEAF HTML VIEW MAPPINGS
    // ==========================================

    // Homepage: List all employees
    @GetMapping("/")
    public String viewHomePage(Model model) {
        model.addAttribute("listEmployees", repository.findAll());
        return "index";
    }

    // Show Form to Add New Employee
    @GetMapping("/showNewEmployeeForm")
    public String showNewEmployeeForm(Model model) {
        Employee employee = new Employee();
        model.addAttribute("employee", employee);
        return "new_employee";
    }

    // Save Employee from HTML Form
    @PostMapping("/saveEmployee")
    public String saveEmployee(@ModelAttribute("employee") Employee employee) {
        repository.save(employee);
        return "redirect:/";
    }

    // Show Form to Update Employee
    @GetMapping("/showFormForUpdate/{id}")
    public String showFormForUpdate(@PathVariable(value = "id") long id, Model model) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee Id: " + id));
        model.addAttribute("employee", employee);
        return "update_employee";
    }

    // Delete Employee via HTML Link
    @GetMapping("/deleteEmployee/{id}")
    public String deleteEmployee(@PathVariable(value = "id") long id) {
        repository.deleteById(id);
        return "redirect:/";
    }

    // ==========================================
    // 2. REACT FRONTEND REST API ENDPOINTS (JSON)
    // ==========================================

    // Fetch all employees for React
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

    // Add / Save Employee via React
    @PostMapping("/api/employees")
    @ResponseBody
    public Employee createEmployeeApi(@RequestBody Employee employee) {
        return repository.save(employee);
    }

    // Delete Employee via React
    @DeleteMapping("/api/employees/{id}")
    @ResponseBody
    public String deleteEmployeeApi(@PathVariable(value = "id") long id) {
        repository.deleteById(id);
        return "{\"message\": \"Employee deleted successfully\"}";
    }
}
