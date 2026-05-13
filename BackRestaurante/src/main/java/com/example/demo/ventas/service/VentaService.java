package com.example.demo.ventas.service;

import com.example.demo.model.entity.Producto;
import com.example.demo.model.repository.IProductosRepository;
import com.example.demo.ventas.dto.*;
import com.example.demo.ventas.entity.*;
import com.example.demo.ventas.repository.DetalleVentaRepository;
import com.example.demo.ventas.repository.FacturaRepository;
import com.example.demo.ventas.repository.VentaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class VentaService {

    private static final double IVA_RATE = 0.19;

    private final VentaRepository ventaRepository;
    private final FacturaRepository facturaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final IProductosRepository productosRepository;

    public VentaService(
            VentaRepository ventaRepository,
            FacturaRepository facturaRepository,
            DetalleVentaRepository detalleVentaRepository,
            IProductosRepository productosRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.facturaRepository = facturaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productosRepository = productosRepository;
    }

    @Transactional
    public FacturaResponse crearVenta(CrearVentaRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un producto");
        }

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setClienteNombre(normalizarCliente(request.clienteNombre()));
        venta.setClienteEmail(request.clienteEmail());
        venta.setClienteTelefono(request.clienteTelefono());
        venta.setClienteDireccion(request.clienteDireccion());
        venta.setMetodoPago(request.metodoPago() != null ? request.metodoPago() : MetodoPago.EFECTIVO);
        venta.setEstado(EstadoVenta.PAGADA);

        double subtotalVenta = 0;

        for (DetalleVentaRequest item : request.items()) {
            if (item.cantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a cero");
            }

            Producto producto = productosRepository.findById(item.productoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.productoId()));

            // Eliminada validacion de stock


            double subtotalDetalle = producto.getPrecioUnitario() * item.cantidad();

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setNombreProducto(producto.getNombre());
            detalle.setPrecioUnitario(producto.getPrecioUnitario());
            detalle.setCantidad(item.cantidad());
            detalle.setSubtotal(subtotalDetalle);

            venta.addDetalle(detalle);

            subtotalVenta += subtotalDetalle;
        }

        double iva = subtotalVenta * IVA_RATE;
        double total = subtotalVenta + iva;

        venta.setSubtotal(subtotalVenta);
        venta.setIva(iva);
        venta.setTotal(total);

        Factura factura = new Factura();
        factura.setFechaEmision(LocalDateTime.now());
        factura.setSubtotal(subtotalVenta);
        factura.setIva(iva);
        factura.setTotal(total);
        factura.setEstado("PAGADA");

        venta.setFactura(factura);

        Venta ventaGuardada = ventaRepository.save(venta);

        factura.setNumeroFactura(generarNumeroFactura(ventaGuardada.getId()));
        ventaGuardada.getFactura().setNumeroFactura(factura.getNumeroFactura());

        Venta ventaActualizada = ventaRepository.save(ventaGuardada);

        return mapFacturaResponse(ventaActualizada);
    }

    public FacturaResponse obtenerFacturaPorVenta(Long ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        return mapFacturaResponse(venta);
    }

    public List<VentaReporteResponse> listarVentas() {
        return ventaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Venta::getFecha).reversed())
                .map(this::mapVentaReporte)
                .toList();
    }

    public ResumenVentasResponse obtenerResumen() {
        LocalDate hoy = LocalDate.now();

        LocalDateTime inicioDia = hoy.atStartOfDay();
        LocalDateTime finDia = hoy.plusDays(1).atStartOfDay();

        LocalDateTime inicioMes = hoy.withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = hoy.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        List<Venta> ventasHoy = ventaRepository.findByFechaBetweenOrderByFechaDesc(inicioDia, finDia);
        List<Venta> ventasMes = ventaRepository.findByFechaBetweenOrderByFechaDesc(inicioMes, finMes);

        double totalHoy = ventasHoy.stream().mapToDouble(Venta::getTotal).sum();
        double totalMes = ventasMes.stream().mapToDouble(Venta::getTotal).sum();

        double ticketPromedio = ventasMes.isEmpty()
                ? 0
                : totalMes / ventasMes.size();

        String productoMasVendido = detalleVentaRepository.productosMasVendidos()
                .stream()
                .findFirst()
                .map(row -> String.valueOf(row[0]))
                .orElse("Sin ventas");

        return new ResumenVentasResponse(
                ventasHoy.size(),
                totalHoy,
                ventasMes.size(),
                totalMes,
                ticketPromedio,
                productoMasVendido
        );
    }

    public List<ProductoVendidoResponse> productosMasVendidos() {
        return detalleVentaRepository.productosMasVendidos()
                .stream()
                .map(row -> new ProductoVendidoResponse(
                        String.valueOf(row[0]),
                        ((Number) row[1]).longValue(),
                        ((Number) row[2]).doubleValue()
                ))
                .toList();
    }

    private VentaReporteResponse mapVentaReporte(Venta venta) {
        return new VentaReporteResponse(
                venta.getId(),
                venta.getFactura() != null ? venta.getFactura().getNumeroFactura() : null,
                venta.getFecha(),
                venta.getClienteNombre(),
                venta.getMetodoPago().name(),
                venta.getTotal(),
                venta.getEstado().name()
        );
    }

    private FacturaResponse mapFacturaResponse(Venta venta) {
        return new FacturaResponse(
                venta.getId(),
                venta.getFactura().getNumeroFactura(),
                venta.getFecha(),
                venta.getClienteNombre(),
                venta.getClienteEmail(),
                venta.getClienteTelefono(),
                venta.getClienteDireccion(),
                venta.getMetodoPago().name(),
                venta.getSubtotal(),
                venta.getIva(),
                venta.getTotal(),
                venta.getEstado().name(),
                venta.getDetalles()
                        .stream()
                        .map(detalle -> new DetalleFacturaResponse(
                                detalle.getNombreProducto(),
                                detalle.getCantidad(),
                                detalle.getPrecioUnitario(),
                                detalle.getSubtotal()
                        ))
                        .toList()
        );
    }

    private String generarNumeroFactura(Long ventaId) {
        return String.format("FAC-%06d", ventaId);
    }

    private String normalizarCliente(String clienteNombre) {
        if (clienteNombre == null || clienteNombre.isBlank()) {
            return "Consumidor final";
        }

        return clienteNombre;
    }
}