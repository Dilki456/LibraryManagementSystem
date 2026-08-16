package com.example.user_service.repository;

import com.example.user_service.model.ApiKey;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ApiKeyRepository extends MongoRepository<ApiKey, String> {
    Optional<ApiKey> findByApiKeyAndActiveTrue(String apiKey);
}