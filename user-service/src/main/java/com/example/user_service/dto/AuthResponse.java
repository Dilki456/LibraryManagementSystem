package com.example.user_service.dto;

public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String role;

    public AuthResponse(String token, String id, String email, String role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}