package com.example.demo.ventas.dto;

public record DetalleVentaRequest(
        Long productoId,
        int cantidad
) {
}