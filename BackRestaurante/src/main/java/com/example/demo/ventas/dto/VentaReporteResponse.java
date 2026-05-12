package com.example.demo.ventas.dto;

import java.time.LocalDateTime;

public record VentaReporteResponse(
        Long ventaId,
        String numeroFactura,
        LocalDateTime fecha,
        String clienteNombre,
        String metodoPago,
        double total,
        String estado
) {
}