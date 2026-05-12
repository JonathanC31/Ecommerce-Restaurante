package com.example.demo.ventas.controller;

import com.example.demo.ventas.dto.*;
import com.example.demo.ventas.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @PostMapping("/ventas")
    public ResponseEntity<FacturaResponse> crearVenta(
            @RequestBody CrearVentaRequest request
    ) {
        return ResponseEntity.ok(ventaService.crearVenta(request));
    }

    @GetMapping("/ventas/{id}/factura")
    public ResponseEntity<FacturaResponse> obtenerFactura(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ventaService.obtenerFacturaPorVenta(id));
    }

    @GetMapping("/reportes/ventas")
    public ResponseEntity<List<VentaReporteResponse>> listarVentas() {
        return ResponseEntity.ok(ventaService.listarVentas());
    }

    @GetMapping("/reportes/ventas/resumen")
    public ResponseEntity<ResumenVentasResponse> resumenVentas() {
        return ResponseEntity.ok(ventaService.obtenerResumen());
    }

    @GetMapping("/reportes/ventas/productos-mas-vendidos")
    public ResponseEntity<List<ProductoVendidoResponse>> productosMasVendidos() {
        return ResponseEntity.ok(ventaService.productosMasVendidos());
    }
}