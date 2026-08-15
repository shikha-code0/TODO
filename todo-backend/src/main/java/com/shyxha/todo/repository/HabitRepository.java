package com.shyxha.todo.repository;

import com.shyxha.todo.entity.Habit;
import com.shyxha.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUser(User user);
}
