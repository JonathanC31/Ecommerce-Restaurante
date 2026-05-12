package com.example.demo.ventas.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FacturaResponse(
        Long ventaId,
        String numeroFactura,
        LocalDateTime fecha,
        String clienteNombre,
        String clienteEmail,
        String clienteTelefono,
        String clienteDireccion,
        String metodoPago,
        double subtotal,
        double iva,
        double total,
        String estado,
        List<DetalleFacturaResponse> items
) {
}