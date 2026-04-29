package com.example.demo.auth.dto;

public record LoginRequest(
        String email,
        String password
) {
}