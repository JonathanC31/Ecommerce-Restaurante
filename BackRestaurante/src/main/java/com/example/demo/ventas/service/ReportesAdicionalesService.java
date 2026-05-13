package com.example.demo.ventas.service;

import com.example.demo.inventario.entity.MovimientoInventario;
import com.example.demo.inventario.entity.TipoMovimientoInventario;
import com.example.demo.inventario.repository.MovimientoInventarioRepository;
import com.example.demo.ventas.dto.*;
import com.example.demo.ventas.entity.Factura;
import com.example.demo.ventas.entity.Venta;
import com.example.demo.ventas.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportesAdicionalesService {

    private final VentaRepository ventaRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;

    public ReportesAdicionalesService(VentaRepository ventaRepository, MovimientoInventarioRepository movimientoInventarioRepository) {
        this.ventaRepository = ventaRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
    }

    public List<FacturaReporteResponse> getReporteFacturacion() {
        return ventaRepository.findAll().stream()
                .filter(v -> v.getFactura() != null)
                .map(v -> mapToFacturaReporte(v.getFactura(), v))
                .sorted(Comparator.comparing(FacturaReporteResponse::fechaEmision).reversed())
                .collect(Collectors.toList());
    }

    public ResumenFacturacionResponse getResumenFacturacion() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        List<Venta> ventasMes = ventaRepository.findAll().stream()
                .filter(v -> v.getFactura() != null && !v.getFecha().isBefore(inicioMes))
                .collect(Collectors.toList());

        long totalFacturas = ventasMes.size();
        double totalFacturado = ventasMes.stream().mapToDouble(Venta::getTotal).sum();

        long validadas = 0;
        long pendientes = 0;
        long rechazadas = 0;

        for (Venta v : ventasMes) {
            String estado = mapEstadoDIAN(v.getFactura().getEstado());
            if ("VALIDADA".equals(estado)) validadas++;
            else if ("PENDIENTE".equals(estado)) pendientes++;
            else rechazadas++;
        }

        return new ResumenFacturacionResponse(totalFacturas, totalFacturado, validadas, pendientes, rechazadas);
    }

    public ResumenContabilidadResponse getResumenContabilidad() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        List<Venta> ventasMes = ventaRepository.findAll().stream()
                .filter(v -> !v.getFecha().isBefore(inicioMes))
                .collect(Collectors.toList());

        double ingresosMes = ventasMes.stream().mapToDouble(Venta::getTotal).sum();
        double ivaGenerado = ventasMes.stream().mapToDouble(Venta::getIva).sum();

        // Obtener movimientos de inventario del mes
        List<MovimientoInventario> movimientosMes = movimientoInventarioRepository.findAll().stream()
                .filter(m -> !m.getFecha().isBefore(inicioMes))
                .collect(Collectors.toList());

        double egresosMes = movimientosMes.stream()
                .filter(m -> m.getTipo() == TipoMovimientoInventario.ENTRADA)
                .mapToDouble(m -> m.getCantidad() * m.getCostoUnitario())
                .sum();

        double desperdicioValorizado = movimientosMes.stream()
                .filter(m -> m.getTipo() == TipoMovimientoInventario.DESPERDICIO)
                .mapToDouble(m -> m.getCantidad() * m.getCostoUnitario())
                .sum();

        double utilidadEstimada = ingresosMes - egresosMes - desperdicioValorizado;

        return new ResumenContabilidadResponse(ingresosMes, egresosMes, ivaGenerado, desperdicioValorizado, utilidadEstimada);
    }

    public List<MovimientoContableResponse> getMovimientosContables() {
        List<MovimientoContableResponse> movimientos = new ArrayList<>();

        // Ingresos de ventas
        List<Venta> ventas = ventaRepository.findAll();
        for (Venta v : ventas) {
            movimientos.add(new MovimientoContableResponse(
                    "INGRESO",
                    "Venta / Factura: " + (v.getFactura() != null ? v.getFactura().getNumeroFactura() : "N/A"),
                    v.getTotal(),
                    v.getFecha()
            ));
        }

        // Egresos y desperdicios del inventario
        List<MovimientoInventario> movsInventario = movimientoInventarioRepository.findAll();
        for (MovimientoInventario m : movsInventario) {
            if (m.getTipo() == TipoMovimientoInventario.ENTRADA) {
                movimientos.add(new MovimientoContableResponse(
                        "EGRESO",
                        "Compra de materia prima: " + m.getItem().getNombre(),
                        m.getCantidad() * m.getCostoUnitario(),
                        m.getFecha()
                ));
            } else if (m.getTipo() == TipoMovimientoInventario.DESPERDICIO) {
                movimientos.add(new MovimientoContableResponse(
                        "PERDIDA",
                        "Desperdicio de materia prima: " + m.getItem().getNombre(),
                        m.getCantidad() * m.getCostoUnitario(),
                        m.getFecha()
                ));
            }
        }

        // Ordenar por fecha descendente
        movimientos.sort(Comparator.comparing(MovimientoContableResponse::fecha).reversed());

        return movimientos;
    }

    private FacturaReporteResponse mapToFacturaReporte(Factura factura, Venta venta) {
        return new FacturaReporteResponse(
                venta.getId(),
                factura.getNumeroFactura(),
                factura.getFechaEmision(),
                venta.getClienteNombre(),
                venta.getMetodoPago() != null ? venta.getMetodoPago().name() : "N/A",
                factura.getSubtotal(),
                factura.getIva(),
                factura.getTotal(),
                mapEstadoDIAN(factura.getEstado())
        );
    }

    private String mapEstadoDIAN(String estadoOriginal) {
        if (estadoOriginal == null || estadoOriginal.isEmpty() || estadoOriginal.equalsIgnoreCase("EMITIDA") || estadoOriginal.equalsIgnoreCase("PAGADA")) {
            return "VALIDADA"; // Factura normal
        }
        if (estadoOriginal.toUpperCase().contains("PENDIENTE")) {
            return "PENDIENTE";
        }
        if (estadoOriginal.toUpperCase().contains("RECHAZADA") || estadoOriginal.toUpperCase().contains("ANULADA")) {
            return "RECHAZADA";
        }
        return "VALIDADA"; // Fallback
    }
}
