package com.shyxha.todo.dto;

public class HabitRequest {
    private String name;
    private boolean done;
    private String email;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
