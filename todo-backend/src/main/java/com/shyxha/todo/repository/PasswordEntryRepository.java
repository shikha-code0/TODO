package com.shyxha.todo.repository;

import com.shyxha.todo.entity.PasswordEntry;
import com.shyxha.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {
    List<PasswordEntry> findByUser(User user);
    List<PasswordEntry> findByUserAndWebsiteContainingIgnoreCase(User user, String keyword);
}
