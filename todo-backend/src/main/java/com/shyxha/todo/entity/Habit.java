package com.shyxha.todo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Whether this habit is marked done for today
    private boolean done;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Habit() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
