package com.shyxha.todo.service.impl;

import com.shyxha.todo.dto.DashboardStatsDto;
import com.shyxha.todo.dto.TaskResponse;
import java.util.stream.Collectors;
import com.shyxha.todo.dto.TaskRequest;
import com.shyxha.todo.entity.Task;
import com.shyxha.todo.entity.User;
import com.shyxha.todo.repository.TaskRepository;
import com.shyxha.todo.repository.UserRepository;
import com.shyxha.todo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String createTask(TaskRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCategory(request.getCategory());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        task.setDueDate(request.getDueDate());
        task.setUser(user);

        taskRepository.save(task);
        return "Task Created Successfully";
    }

    @Override
    public List<TaskResponse> getAllTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByUser(user)
                .stream()
                .map(task -> new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getCategory(),
                        task.getPriority(),
                        task.getStatus(),
                        task.getDueDate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task Not Found"));
    }

    @Override
    public String updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task Not Found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCategory(request.getCategory());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        taskRepository.save(task);
        return "Task Updated Successfully";
    }

    @Override
    public String deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task Not Found"));
        taskRepository.delete(task);
        return "Task Deleted Successfully";
    }

    @Override
    public List<TaskResponse> searchTasks(String email, String keyword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByUserAndTitleContainingIgnoreCase(user, keyword)
                .stream()
                .map(task -> new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getCategory(),
                        task.getPriority(),
                        task.getStatus(),
                        task.getDueDate()
                ))
                .toList();
    }

    @Override
    public Task updateStatus(Long id, String status) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(status);
        return taskRepository.save(task);
    }

    @Override
    public DashboardStatsDto getDashboardStats(String email) {
        long total     = taskRepository.countByUserEmail(email);
        long completed = taskRepository.countByUserEmailAndStatus(email, "COMPLETED");
        long pending   = taskRepository.countByUserEmailAndStatus(email, "PENDING");
        long high      = taskRepository.countByUserEmailAndPriority(email, "HIGH");

        return new DashboardStatsDto(total, completed, pending, high);
    }
}