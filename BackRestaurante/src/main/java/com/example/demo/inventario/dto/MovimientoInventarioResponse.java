package com.example.demo.inventario.dto;

import com.example.demo.inventario.entity.TipoMovimientoInventario;
import java.time.LocalDateTime;

public record MovimientoInventarioResponse(
        Long id,
        Long itemId,
        String itemNombre,
        TipoMovimientoInventario tipo,
        double cantidad,
        double cantidadAnterior,
        double cantidadNueva,
        double costoUnitario,
        String motivo,
        String observacion,
        LocalDateTime fecha
) {
}
