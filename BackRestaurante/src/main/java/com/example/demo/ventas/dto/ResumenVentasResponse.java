package com.example.demo.ventas.dto;

public record ResumenVentasResponse(
        long ventasHoy,
        double totalVentasHoy,
        long ventasMes,
        double totalVentasMes,
        double ticketPromedio,
        String productoMasVendido
) {
}