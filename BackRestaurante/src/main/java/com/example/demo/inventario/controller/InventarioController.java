package com.example.demo.inventario.controller;

import com.example.demo.inventario.dto.*;
import com.example.demo.inventario.service.InventarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@PreAuthorize("hasRole('ADMIN')")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public ResponseEntity<List<InventarioItemResponse>> getAll() {
        return ResponseEntity.ok(inventarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.findById(id));
    }

    @PostMapping
    public ResponseEntity<InventarioItemResponse> create(@RequestBody InventarioItemRequest request) {
        return ResponseEntity.ok(inventarioService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioItemResponse> update(@PathVariable Long id, @RequestBody InventarioItemRequest request) {
        return ResponseEntity.ok(inventarioService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/movimientos")
    public ResponseEntity<MovimientoInventarioResponse> registrarMovimiento(@RequestBody MovimientoInventarioRequest request) {
        return ResponseEntity.ok(inventarioService.registrarMovimiento(request));
    }

    @GetMapping("/movimientos")
    public ResponseEntity<List<MovimientoInventarioResponse>> listarMovimientos() {
        return ResponseEntity.ok(inventarioService.listarMovimientos());
    }

    @GetMapping("/resumen")
    public ResponseEntity<InventarioResumenResponse> getResumen() {
        return ResponseEntity.ok(inventarioService.obtenerResumen());
    }

    @GetMapping("/vencimientos")
    public ResponseEntity<List<InventarioItemResponse>> getVencimientos(@RequestParam(defaultValue = "7") int dias) {
        return ResponseEntity.ok(inventarioService.listarVencimientos(dias));
    }

    @GetMapping("/desperdicios")
    public ResponseEntity<List<MovimientoInventarioResponse>> getDesperdicios() {
        return ResponseEntity.ok(inventarioService.listarDesperdicios());
    }
}
