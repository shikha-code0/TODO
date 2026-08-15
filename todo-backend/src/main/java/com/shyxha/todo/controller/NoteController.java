package com.shyxha.todo.controller;

import com.shyxha.todo.dto.NoteRequest;
import com.shyxha.todo.dto.NoteResponse;
import com.shyxha.todo.entity.Note;
import com.shyxha.todo.entity.User;
import com.shyxha.todo.repository.NoteRepository;
import com.shyxha.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    // GET all notes for user
    @GetMapping
    public ResponseEntity<List<NoteResponse>> getNotes(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<NoteResponse> notes = noteRepository.findByUser(user)
                .stream()
                .map(n -> new NoteResponse(n.getId(), n.getTitle(), n.getContent(), n.getCreatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notes);
    }

    // POST create note
    @PostMapping
    public ResponseEntity<String> createNote(@RequestBody NoteRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setUser(user);
        noteRepository.save(note);

        return ResponseEntity.ok("Note Created Successfully");
    }

    // PUT update note
    @PutMapping("/{id}")
    public ResponseEntity<String> updateNote(@PathVariable Long id, @RequestBody NoteRequest request) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note Not Found"));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        noteRepository.save(note);

        return ResponseEntity.ok("Note Updated Successfully");
    }

    // DELETE note
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note Not Found"));

        noteRepository.delete(note);
        return ResponseEntity.ok("Note Deleted Successfully");
    }

    // GET search notes
    @GetMapping("/search")
    public ResponseEntity<List<NoteResponse>> searchNotes(
            @RequestParam String email,
            @RequestParam String keyword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<NoteResponse> notes = noteRepository
                .findByUserAndTitleContainingIgnoreCase(user, keyword)
                .stream()
                .map(n -> new NoteResponse(n.getId(), n.getTitle(), n.getContent(), n.getCreatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notes);
    }
}
