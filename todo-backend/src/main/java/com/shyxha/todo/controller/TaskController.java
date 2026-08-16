package com.shyxha.todo.controller;
import com.shyxha.todo.dto.DashboardStatsDto;
import com.shyxha.todo.dto.TaskResponse;
import com.shyxha.todo.dto.TaskRequest;
import com.shyxha.todo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shyxha.todo.entity.Task;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<String> createTask(@RequestBody TaskRequest request) {

        return ResponseEntity.ok(taskService.createTask(request));

    }
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(@RequestParam String email) {

        return ResponseEntity.ok(taskService.getAllTasks(email));

    }
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {

        return ResponseEntity.ok(taskService.getTaskById(id));

    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable Long id,
                                             @RequestBody TaskRequest request) {

        return ResponseEntity.ok(taskService.updateTask(id, request));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {

        return ResponseEntity.ok(taskService.deleteTask(id));

    }
    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(
            @RequestParam String email,
            @RequestParam String keyword) {

        return ResponseEntity.ok(taskService.searchTasks(email, keyword));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Task updatedTask = taskService.updateStatus(id, status);

        return ResponseEntity.ok(updatedTask);
    }
    @GetMapping("/stats")
    public DashboardStatsDto getStats(
            @RequestParam String email){

        return taskService.getDashboardStats(email);

    }

}