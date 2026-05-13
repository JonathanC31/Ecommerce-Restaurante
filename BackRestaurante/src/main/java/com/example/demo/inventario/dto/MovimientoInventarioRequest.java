package com.example.demo.inventario.dto;

import com.example.demo.inventario.entity.TipoMovimientoInventario;

public record MovimientoInventarioRequest(
        Long itemId,
        TipoMovimientoInventario tipo,
        double cantidad,
        String motivo,
        String observacion
) {
}
