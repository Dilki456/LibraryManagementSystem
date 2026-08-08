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
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. Skip API Key verification for public authentication and documentation endpoints
        if (path.startsWith("/auth/") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.equals("/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Read X-API-KEY header (passed by API Gateway or direct client request)
        String apiKey = request.getHeader("X-API-KEY");
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = request.getParameter("apiKey");
        }

        // 3. Verify key against MongoDB
        if (apiKey != null && apiKeyRepository.findByApiKeyAndActiveTrue(apiKey).isPresent()) {
            // Set temporary authentication context so Spring Security permits execution
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(apiKey, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or missing API Key");
        }
    }
}