package com.example.demo.ventas.dto;

public record ResumenFacturacionResponse(
        long totalFacturasMes,
        double totalFacturadoMes,
        long facturasValidadas,
        long facturasPendientes,
        long facturasRechazadas
) {
}
