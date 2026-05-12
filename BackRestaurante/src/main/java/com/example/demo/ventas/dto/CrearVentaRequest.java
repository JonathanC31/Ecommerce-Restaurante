package com.example.demo.ventas.dto;

import com.example.demo.ventas.entity.MetodoPago;

import java.util.List;

public record CrearVentaRequest(
        String clienteNombre,
        String clienteEmail,
        String clienteTelefono,
        String clienteDireccion,
        MetodoPago metodoPago,
        List<DetalleVentaRequest> items
) {
}