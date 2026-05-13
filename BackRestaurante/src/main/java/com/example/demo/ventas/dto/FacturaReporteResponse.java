package com.example.demo.ventas.dto;

import java.time.LocalDateTime;

public record FacturaReporteResponse(
        Long ventaId,
        String numeroFactura,
        LocalDateTime fechaEmision,
        String clienteNombre,
        String metodoPago,
        double subtotal,
        double iva,
        double total,
        String estado
) {
}
