package com.example.demo.ventas.controller;

import com.example.demo.ventas.dto.FacturaReporteResponse;
import com.example.demo.ventas.dto.MovimientoContableResponse;
import com.example.demo.ventas.dto.ResumenContabilidadResponse;
import com.example.demo.ventas.dto.ResumenFacturacionResponse;
import com.example.demo.ventas.service.ReportesAdicionalesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@PreAuthorize("hasRole('ADMIN')")
public class ReportesAdicionalesController {

    private final ReportesAdicionalesService reportesService;

    public ReportesAdicionalesController(ReportesAdicionalesService reportesService) {
        this.reportesService = reportesService;
    }

    @GetMapping("/facturacion")
    public ResponseEntity<List<FacturaReporteResponse>> getFacturacion() {
        return ResponseEntity.ok(reportesService.getReporteFacturacion());
    }

    @GetMapping("/facturacion/resumen")
    public ResponseEntity<ResumenFacturacionResponse> getResumenFacturacion() {
        return ResponseEntity.ok(reportesService.getResumenFacturacion());
    }

    @GetMapping("/contabilidad/resumen")
    public ResponseEntity<ResumenContabilidadResponse> getResumenContabilidad() {
        return ResponseEntity.ok(reportesService.getResumenContabilidad());
    }

    @GetMapping("/contabilidad/movimientos")
    public ResponseEntity<List<MovimientoContableResponse>> getMovimientosContables() {
        return ResponseEntity.ok(reportesService.getMovimientosContables());
    }
}
