package com.example.demo.inventario.service;

import com.example.demo.inventario.dto.*;
import com.example.demo.inventario.entity.InventarioItem;
import com.example.demo.inventario.entity.MovimientoInventario;
import com.example.demo.inventario.entity.TipoMovimientoInventario;
import com.example.demo.inventario.repository.InventarioItemRepository;
import com.example.demo.inventario.repository.MovimientoInventarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventarioService {

    private final InventarioItemRepository itemRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    public InventarioService(InventarioItemRepository itemRepository, MovimientoInventarioRepository movimientoRepository) {
        this.itemRepository = itemRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public List<InventarioItemResponse> findAll() {
        return itemRepository.findByActivoTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InventarioItemResponse findById(Long id) {
        InventarioItem item = getActivoItem(id);
        return mapToResponse(item);
    }

    @Transactional
    public InventarioItemResponse create(InventarioItemRequest request) {
        InventarioItem item = new InventarioItem();
        updateItemFromRequest(item, request);
        return mapToResponse(itemRepository.save(item));
    }

    @Transactional
    public InventarioItemResponse update(Long id, InventarioItemRequest request) {
        InventarioItem item = getActivoItem(id);
        updateItemFromRequest(item, request);
        return mapToResponse(itemRepository.save(item));
    }

    @Transactional
    public void delete(Long id) {
        InventarioItem item = getActivoItem(id);
        item.setActivo(false);
        itemRepository.save(item);
    }

    @Transactional
    public MovimientoInventarioResponse registrarMovimiento(MovimientoInventarioRequest request) {
        if (request.cantidad() < 0) {
            throw new RuntimeException("La cantidad no puede ser negativa");
        }

        InventarioItem item = getActivoItem(request.itemId());
        double cantidadAnterior = item.getCantidadDisponible();
        double cantidadNueva = cantidadAnterior;

        switch (request.tipo()) {
            case ENTRADA:
                cantidadNueva = cantidadAnterior + request.cantidad();
                break;
            case SALIDA:
            case DESPERDICIO:
                if (cantidadAnterior < request.cantidad()) {
                    throw new RuntimeException("Existencia insuficiente para la salida o desperdicio");
                }
                cantidadNueva = cantidadAnterior - request.cantidad();
                break;
            case AJUSTE:
                cantidadNueva = request.cantidad();
                break;
        }

        item.setCantidadDisponible(cantidadNueva);
        itemRepository.save(item);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setItem(item);
        movimiento.setTipo(request.tipo());
        movimiento.setCantidad(request.cantidad());
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadNueva(cantidadNueva);
        movimiento.setCostoUnitario(item.getCostoUnitario());
        movimiento.setMotivo(request.motivo());
        movimiento.setObservacion(request.observacion());
        movimiento.setFecha(LocalDateTime.now());

        movimiento = movimientoRepository.save(movimiento);

        return mapToMovimientoResponse(movimiento);
    }

    public List<MovimientoInventarioResponse> listarMovimientos() {
        return movimientoRepository.findByOrderByFechaDesc().stream()
                .map(this::mapToMovimientoResponse)
                .collect(Collectors.toList());
    }

    public InventarioResumenResponse obtenerResumen() {
        List<InventarioItem> activos = itemRepository.findByActivoTrue();
        
        long totalItems = activos.size();
        long itemsBajoStock = activos.stream().filter(InventarioItem::isBajoStock).count();
        
        LocalDate in7Days = LocalDate.now().plusDays(7);
        long itemsPorVencer = activos.stream()
                .filter(i -> i.getFechaVencimiento() != null && !i.getFechaVencimiento().isAfter(in7Days))
                .count();

        double costoTotalInventario = activos.stream()
                .mapToDouble(i -> i.getCantidadDisponible() * i.getCostoUnitario())
                .sum();

        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        List<MovimientoInventario> desperdicios = movimientoRepository.findByTipoAndFechaAfter(TipoMovimientoInventario.DESPERDICIO, inicioMes);
        
        double costoDesperdicioMes = desperdicios.stream()
                .mapToDouble(m -> m.getCantidad() * m.getCostoUnitario())
                .sum();

        return new InventarioResumenResponse(
                totalItems, itemsBajoStock, itemsPorVencer, costoTotalInventario, costoDesperdicioMes
        );
    }

    public List<InventarioItemResponse> listarVencimientos(int dias) {
        LocalDate limitDate = LocalDate.now().plusDays(dias);
        return itemRepository.findByActivoTrue().stream()
                .filter(i -> i.getFechaVencimiento() != null && !i.getFechaVencimiento().isAfter(limitDate))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MovimientoInventarioResponse> listarDesperdicios() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        return movimientoRepository.findByTipoAndFechaAfter(TipoMovimientoInventario.DESPERDICIO, inicioMes)
                .stream()
                .map(this::mapToMovimientoResponse)
                .collect(Collectors.toList());
    }

    private InventarioItem getActivoItem(Long id) {
        InventarioItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        if (!item.isActivo()) {
            throw new RuntimeException("Item no encontrado (inactivo)");
        }
        return item;
    }

    private void updateItemFromRequest(InventarioItem item, InventarioItemRequest request) {
        item.setNombre(request.nombre());
        item.setCategoria(request.categoria());
        item.setUnidadMedida(request.unidadMedida());
        item.setCantidadDisponible(request.cantidadDisponible());
        item.setStockMinimo(request.stockMinimo());
        item.setCostoUnitario(request.costoUnitario());
        item.setFechaVencimiento(request.fechaVencimiento());
        item.setProveedor(request.proveedor());
    }

    private InventarioItemResponse mapToResponse(InventarioItem item) {
        return new InventarioItemResponse(
                item.getId(),
                item.getNombre(),
                item.getCategoria(),
                item.getUnidadMedida(),
                item.getCantidadDisponible(),
                item.getStockMinimo(),
                item.getCostoUnitario(),
                item.getFechaVencimiento(),
                item.getProveedor(),
                item.isActivo(),
                item.isBajoStock()
        );
    }

    private MovimientoInventarioResponse mapToMovimientoResponse(MovimientoInventario mov) {
        return new MovimientoInventarioResponse(
                mov.getId(),
                mov.getItem().getId(),
                mov.getItem().getNombre(),
                mov.getTipo(),
                mov.getCantidad(),
                mov.getCantidadAnterior(),
                mov.getCantidadNueva(),
                mov.getCostoUnitario(),
                mov.getMotivo(),
                mov.getObservacion(),
                mov.getFecha()
        );
    }
}
