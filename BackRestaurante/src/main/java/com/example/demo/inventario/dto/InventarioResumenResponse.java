package com.example.demo.inventario.dto;

public record InventarioResumenResponse(
        long totalItems,
        long itemsBajoStock,
        long itemsPorVencer,
        double costoTotalInventario,
        double costoDesperdicioMes
) {
}
