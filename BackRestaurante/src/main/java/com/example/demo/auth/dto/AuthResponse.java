package com.example.demo.auth.dto;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresIn
) {
}