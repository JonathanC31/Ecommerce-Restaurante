package com.example.demo.ventas.dto;

public record ResumenContabilidadResponse(
        double ingresosMes,
        double egresosMes,
        double ivaGenerado,
        double desperdicioValorizado,
        double utilidadEstimada
) {
}
