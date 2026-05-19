package com.example.demo.contabilidad.dto;

import java.time.LocalDateTime;

public record EgresoResponse(
    Long id,
    String descripcion,
    double monto,
    LocalDateTime fecha,
    String categoria,
    Long referenciaId
) {}
