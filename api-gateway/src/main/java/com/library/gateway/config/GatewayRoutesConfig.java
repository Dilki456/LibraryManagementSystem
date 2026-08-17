package com.library.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {

        return builder.routes()

                .route("book-service", r -> r
                        .path("/books", "/books/**")
                        .uri("http://book-service:8080"))

                .route("user-auth-service", r -> r
                        .path("/auth", "/auth/**")
                        .uri("http://user-service:8081"))

                .route("user-service", r -> r
                        .path("/users", "/users/**")
                        .uri("http://user-service:8081"))

                .route("borrow-service", r -> r
                        .path("/api/borrow", "/api/borrow/**")
                        .uri("http://borrow-service:8083"))

                .route("notification-service", r -> r
                        .path("/api/notifications", "/api/notifications/**")
                        .uri("http://notification-service:8084"))

                .build();
    }
}
