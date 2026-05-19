package com.example.demo.ventas.dto;

import com.example.demo.ventas.entity.MetodoPago;

import java.util.List;

public record CrearVentaRequest(
        String clienteNombre,
        String clienteEmail,
        String clienteTelefono,
        String clienteDireccion,
        String barrioEntrega,
        String descripcionUbicacion,
        String indicacionesEntrega,
        String celularNequi,
        MetodoPago metodoPago,
        List<DetalleVentaRequest> items
) {
}