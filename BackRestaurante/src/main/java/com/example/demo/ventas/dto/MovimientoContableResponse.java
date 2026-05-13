package com.example.demo.ventas.dto;

import java.time.LocalDateTime;

public record MovimientoContableResponse(
        String tipo,
        String descripcion,
        double valor,
        LocalDateTime fecha
) {
}
