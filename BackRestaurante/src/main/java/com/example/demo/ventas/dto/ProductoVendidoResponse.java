package com.example.demo.ventas.dto;

public record ProductoVendidoResponse(
        String producto,
        long cantidad,
        double total
) {
}