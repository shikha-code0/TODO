package com.shyxha.todo.dto;

public class NoteRequest {
    private String title;
    private String content;
    private String email;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
