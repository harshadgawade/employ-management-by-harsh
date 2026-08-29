package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    // 1. Homepage: List all employees (Dark Glassmorphism UI)
    @GetMapping("/")
    public String viewHomePage(Model model) {
        model.addAttribute("listEmployees", repository.findAll());
        return "index";
    }

    // 2. Show Form to Add New Employee
    @GetMapping("/showNewEmployeeForm")
    public String showNewEmployeeForm(Model model) {
        Employee employee = new Employee();
        model.addAttribute("employee", employee);
        return "add-employee";
    }

    // 3. Save Employee (Add or Update)
    @PostMapping("/saveEmployee")
    public String saveEmployee(@ModelAttribute("employee") Employee employee) {
        repository.save(employee);
        return "redirect:/";
    }

    // 4. Show Form for Update
    @GetMapping("/showFormForUpdate/{id}")
    public String showFormForUpdate(@PathVariable(value = "id") long id, Model model) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee Id: " + id));
        model.addAttribute("employee", employee);
        return "add-employee"; // Same form can be reused for update
    }

    // 5. Delete Employee
    @GetMapping("/deleteEmployee/{id}")
    public String deleteEmployee(@PathVariable(value = "id") long id) {
        repository.deleteById(id);
        return "redirect:/";
    }

    // ==========================================
    // REST API ENDPOINTS (For React / Mobile App)
    // ==========================================

    @GetMapping("/api/employees")
    @ResponseBody
    public List<Employee> getEmployeesApi() {
        return repository.findAll();
    }

    @PostMapping("/api/auth/verify-otp")
    @ResponseBody
    public String verifyOtp(@RequestBody String body) {
        return "{\"success\": true, \"token\": \"jwt-session-token-xyz\"}";
    }
}
