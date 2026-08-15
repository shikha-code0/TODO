package com.shyxha.todo.service;

import com.shyxha.todo.dto.DashboardStatsDto;
import com.shyxha.todo.dto.TaskRequest;
import com.shyxha.todo.entity.Task;
import java.util.List;
import com.shyxha.todo.dto.TaskResponse;

public interface TaskService {

    String createTask(TaskRequest request);
    List<TaskResponse> getAllTasks(String email);
    Task getTaskById(Long id);
    String updateTask(Long id, TaskRequest request);
    String deleteTask(Long id);
    List<TaskResponse> searchTasks(String email, String keyword);
    Task updateStatus(Long id, String status);
    DashboardStatsDto getDashboardStats(String email);
}