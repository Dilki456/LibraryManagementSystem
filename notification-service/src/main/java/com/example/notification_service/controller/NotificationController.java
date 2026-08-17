package com.example.notification_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.notification_service.entity.Notification;
import com.example.notification_service.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    @PostMapping
    public Notification createNotification(
            @RequestParam String userId,
            @RequestParam String message,
            @RequestParam String type) {

        Notification notification =
                new Notification(
                        userId,
                        message,
                        type
                );

        return notificationRepository.save(
                notification
        );
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
