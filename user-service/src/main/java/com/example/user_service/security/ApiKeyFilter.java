package com.example.user_service.security;

import com.example.user_service.repository.ApiKeyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Get servlet path without the /api context path
        String path = request.getServletPath();

        // 1. Skip API Key verification for public endpoints
        if (path.startsWith("/auth/")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/webjars/")
                || path.equals("/")) {

            filterChain.doFilter(request, response);
            return;
        }

        // 2. Read X-API-KEY header
        String apiKey = request.getHeader("X-API-KEY");

        // Also allow API key as request parameter
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = request.getParameter("apiKey");
        }

        // 3. Verify API key against MongoDB
        if (apiKey != null
                && !apiKey.isBlank()
                && apiKeyRepository.findByApiKeyAndActiveTrue(apiKey).isPresent()) {

            // Set authentication if not already authenticated
            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                apiKey,
                                null,
                                Collections.emptyList()
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);
            }

            filterChain.doFilter(request, response);

        } else {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("text/plain");
            response.getWriter().write("Invalid or missing API Key");
        }
    }
}