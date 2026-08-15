package com.shyxha.todo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "password_entries")
public class PasswordEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String website;
    private String username;

    // NOTE: This stores vault passwords in plaintext so they can be retrieved.
    // This is intentional for a personal vault tool.
    // In production, use AES encryption with a user-derived key.
    @Column(name = "vault_password")
    private String vaultPassword;

    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public PasswordEntry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getVaultPassword() { return vaultPassword; }
    public void setVaultPassword(String vaultPassword) { this.vaultPassword = vaultPassword; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
