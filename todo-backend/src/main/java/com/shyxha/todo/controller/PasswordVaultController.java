package com.shyxha.todo.controller;

import com.shyxha.todo.dto.PasswordEntryRequest;
import com.shyxha.todo.dto.PasswordEntryResponse;
import com.shyxha.todo.entity.PasswordEntry;
import com.shyxha.todo.entity.User;
import com.shyxha.todo.repository.PasswordEntryRepository;
import com.shyxha.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/passwords")
@CrossOrigin(origins = "*")
public class PasswordVaultController {

    @Autowired
    private PasswordEntryRepository passwordEntryRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all saved passwords for user
    @GetMapping
    public ResponseEntity<List<PasswordEntryResponse>> getPasswords(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PasswordEntryResponse> entries = passwordEntryRepository.findByUser(user)
                .stream()
                .map(p -> new PasswordEntryResponse(
                        p.getId(), p.getWebsite(), p.getUsername(), p.getVaultPassword(), p.getCategory()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(entries);
    }

    // POST save new password
    @PostMapping
    public ResponseEntity<String> createPassword(@RequestBody PasswordEntryRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PasswordEntry entry = new PasswordEntry();
        entry.setWebsite(request.getWebsite());
        entry.setUsername(request.getUsername());
        entry.setVaultPassword(request.getVaultPassword());
        entry.setCategory(request.getCategory());
        entry.setUser(user);
        passwordEntryRepository.save(entry);

        return ResponseEntity.ok("Password Saved Successfully");
    }

    // PUT update saved password
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Long id,
                                                  @RequestBody PasswordEntryRequest request) {
        PasswordEntry entry = passwordEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry Not Found"));

        entry.setWebsite(request.getWebsite());
        entry.setUsername(request.getUsername());
        entry.setVaultPassword(request.getVaultPassword());
        entry.setCategory(request.getCategory());
        passwordEntryRepository.save(entry);

        return ResponseEntity.ok("Password Updated Successfully");
    }

    // DELETE saved password
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePassword(@PathVariable Long id) {
        PasswordEntry entry = passwordEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry Not Found"));

        passwordEntryRepository.delete(entry);
        return ResponseEntity.ok("Password Deleted Successfully");
    }
}
