package com.shyxha.todo.repository;

import com.shyxha.todo.entity.Task;
import com.shyxha.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user);
    List<Task> findByUserAndTitleContainingIgnoreCase(User user, String title);
    long countByUserEmail(String email);

    long countByUserEmailAndStatus(String email, String status);

    long countByUserEmailAndPriority(String email, String priority);
}