package com.example.demo.ventas.dto;

public record DetalleFacturaResponse(
        String productoNombre,
        int cantidad,
        double precioUnitario,
        double subtotal,
        String especificaciones
) {
}