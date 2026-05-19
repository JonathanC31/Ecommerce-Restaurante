package com.example.demo.contabilidad.controller;

import com.example.demo.contabilidad.dto.EgresoResponse;
import com.example.demo.contabilidad.service.ContabilidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contabilidad")
@CrossOrigin("http://localhost:4200")
public class ContabilidadController {

    private final ContabilidadService contabilidadService;

    public ContabilidadController(ContabilidadService contabilidadService) {
        this.contabilidadService = contabilidadService;
    }

    @GetMapping("/egresos")
    public ResponseEntity<List<EgresoResponse>> listarEgresos() {
        return ResponseEntity.ok(contabilidadService.listarEgresos());
    }
}
