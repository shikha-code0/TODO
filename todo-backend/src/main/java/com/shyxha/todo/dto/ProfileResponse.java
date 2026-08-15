package com.shyxha.todo.dto;

public class ProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String bio;

    public ProfileResponse() {}
    public ProfileResponse(Long id, String fullName, String email, String phone, String location, String bio) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.bio = bio;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
