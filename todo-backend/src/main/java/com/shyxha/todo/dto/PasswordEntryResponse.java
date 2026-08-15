package com.shyxha.todo.dto;

public class PasswordEntryResponse {
    private Long id;
    private String website;
    private String username;
    private String vaultPassword;
    private String category;

    public PasswordEntryResponse() {}
    public PasswordEntryResponse(Long id, String website, String username, String vaultPassword, String category) {
        this.id = id;
        this.website = website;
        this.username = username;
        this.vaultPassword = vaultPassword;
        this.category = category;
    }

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
}
