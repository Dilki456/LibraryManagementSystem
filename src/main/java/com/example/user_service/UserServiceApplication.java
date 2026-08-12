package com.example.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.example.user_service",
    "com.example.book_service",
    "com.example.notification_service"
})
@EnableMongoRepositories(basePackages = {
    "com.example.user_service.repository",
    "com.example.book_service.repository",
    "com.example.notification_service.repository"
})
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}