package com.example.demo.auth.dto;

public record RegisterRequest(
        String nombre,
        String email,
        String password,
        String telefono,
        String direccionEnvio,
        String preferencias
) {
}