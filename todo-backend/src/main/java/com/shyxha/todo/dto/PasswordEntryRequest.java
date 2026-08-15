package com.shyxha.todo.dto;

public class PasswordEntryRequest {
    private String website;
    private String username;
    private String vaultPassword;
    private String category;
    private String email;

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getVaultPassword() { return vaultPassword; }
    public void setVaultPassword(String vaultPassword) { this.vaultPassword = vaultPassword; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
