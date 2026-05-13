package com.example.demo.inventario.dto;

import com.example.demo.inventario.entity.UnidadMedida;
import java.time.LocalDate;

public record InventarioItemResponse(
        Long id,
        String nombre,
        String categoria,
        UnidadMedida unidadMedida,
        double cantidadDisponible,
        double stockMinimo,
        double costoUnitario,
        LocalDate fechaVencimiento,
        String proveedor,
        boolean activo,
        boolean bajoStock
) {
}
