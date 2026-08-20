package com.shyxha.todo.controller;

import com.shyxha.todo.dto.HabitRequest;
import com.shyxha.todo.dto.HabitResponse;
import com.shyxha.todo.entity.Habit;
import com.shyxha.todo.entity.User;
import com.shyxha.todo.repository.HabitRepository;
import com.shyxha.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all habits for user
    @GetMapping
    public ResponseEntity<List<HabitResponse>> getHabits(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<HabitResponse> habits = habitRepository.findByUser(user)
                .stream()
                .map(h -> new HabitResponse(h.getId(), h.getName(), h.isDone()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(habits);
    }

    // POST create habit
    @PostMapping
    public ResponseEntity<String> createHabit(@RequestBody HabitRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Habit habit = new Habit();
        habit.setName(request.getName());
        habit.setDone(false);
        habit.setUser(user);
        habitRepository.save(habit);

        return ResponseEntity.ok("Habit Created Successfully");
    }

    // PUT toggle habit done/undone
    @PutMapping("/{id}/toggle")
    public ResponseEntity<String> toggleHabit(@PathVariable Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit Not Found"));

        habit.setDone(!habit.isDone());
        habitRepository.save(habit);

        return ResponseEntity.ok("Habit Updated");
    }

    // PUT update habit name
    @PutMapping("/{id}")
    public ResponseEntity<String> updateHabit(@PathVariable Long id, @RequestBody HabitRequest request) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit Not Found"));

        habit.setName(request.getName());
        habitRepository.save(habit);

        return ResponseEntity.ok("Habit Updated Successfully");
    }

    // DELETE habit
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHabit(@PathVariable Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit Not Found"));

        habitRepository.delete(habit);
        return ResponseEntity.ok("Habit Deleted Successfully");
    }
}
