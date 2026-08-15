package com.shyxha.todo.repository;

import com.shyxha.todo.entity.Note;
import com.shyxha.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser(User user);
    List<Note> findByUserAndTitleContainingIgnoreCase(User user, String keyword);
}
