package com.example.demo.receta.dto;

public record RecetaItemResponse(
    Long id,
    Long productoId,
    String productoNombre,
    Long inventarioItemId,
    String inventarioItemNombre,
    double cantidadUsada,
    String observacion
) {}
