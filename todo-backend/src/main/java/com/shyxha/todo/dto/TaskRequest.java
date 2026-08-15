package com.shyxha.todo.dto;

import java.time.LocalDate;

public class TaskRequest {

    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private String email;

    public TaskRequest() {
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}