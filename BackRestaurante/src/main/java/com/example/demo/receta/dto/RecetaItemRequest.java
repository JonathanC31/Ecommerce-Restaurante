package com.example.demo.receta.dto;

public record RecetaItemRequest(
    Long inventarioItemId,
    double cantidadUsada,
    String observacion
) {}
