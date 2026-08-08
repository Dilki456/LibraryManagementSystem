package com.example.user_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "api_keys")
public class ApiKey {
    @Id
    private String id;
    private String apiKey;
    private boolean active;

    public ApiKey() {}

    public String getId() { return id; }
    public String getApiKey() { return apiKey; }
    public boolean isActive() { return active; }

    public void setId(String id) { this.id = id; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    public void setActive(boolean active) { this.active = active; }
}