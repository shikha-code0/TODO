package com.shyxha.todo.controller;

import com.shyxha.todo.dto.*;
import com.shyxha.todo.entity.User;
import com.shyxha.todo.repository.UserRepository;
import com.shyxha.todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String result = userService.register(request);
        if (result.equals("Email already exists")) {
            return ResponseEntity.status(409).body(result);
        }
        return ResponseEntity.ok(result);
    }

    // Login - returns JWT
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(userService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(new LoginResponse(null, e.getMessage()));
        }
    }

    // GET profile by email
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse profile = new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getLocation(),
                user.getBio()
        );
        return ResponseEntity.ok(profile);
    }

    // PUT update profile
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody ProfileRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setBio(request.getBio());
        userRepository.save(user);

        return ResponseEntity.ok("Profile Updated Successfully");
    }
}