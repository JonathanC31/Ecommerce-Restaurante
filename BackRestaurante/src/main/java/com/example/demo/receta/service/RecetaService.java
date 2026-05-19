package com.example.demo.receta.service;

import com.example.demo.inventario.entity.InventarioItem;
import com.example.demo.inventario.repository.InventarioItemRepository;
import com.example.demo.model.entity.Producto;
import com.example.demo.model.repository.IProductosRepository;
import com.example.demo.receta.dto.RecetaItemRequest;
import com.example.demo.receta.dto.RecetaItemResponse;
import com.example.demo.receta.entity.RecetaItem;
import com.example.demo.receta.repository.RecetaItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecetaService {

    private final RecetaItemRepository recetaItemRepository;
    private final IProductosRepository productosRepository;
    private final InventarioItemRepository inventarioItemRepository;

    public RecetaService(
            RecetaItemRepository recetaItemRepository,
            IProductosRepository productosRepository,
            InventarioItemRepository inventarioItemRepository
    ) {
        this.recetaItemRepository = recetaItemRepository;
        this.productosRepository = productosRepository;
        this.inventarioItemRepository = inventarioItemRepository;
    }

    public List<RecetaItemResponse> getRecetaByProducto(Long productoId) {
        return recetaItemRepository.findByProductoId(productoId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<RecetaItemResponse> guardarReceta(Long productoId, List<RecetaItemRequest> items) {
        Producto producto = productosRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        // Replace existing recipe
        recetaItemRepository.deleteByProductoId(productoId);

        List<RecetaItem> nuevos = items.stream().map(req -> {
            InventarioItem insumo = inventarioItemRepository.findById(req.inventarioItemId())
                    .orElseThrow(() -> new RuntimeException("Insumo no encontrado: " + req.inventarioItemId()));

            RecetaItem ri = new RecetaItem();
            ri.setProducto(producto);
            ri.setInventarioItem(insumo);
            ri.setCantidadUsada(req.cantidadUsada());
            ri.setObservacion(req.observacion());
            return ri;
        }).collect(Collectors.toList());

        return recetaItemRepository.saveAll(nuevos)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarReceta(Long productoId) {
        recetaItemRepository.deleteByProductoId(productoId);
    }

    /** Called by VentaService when a payment is approved */
    @Transactional
    public void debitarInventarioPorVenta(Long productoId, int cantidadVendida) {
        List<RecetaItem> receta = recetaItemRepository.findByProductoId(productoId);

        for (RecetaItem ri : receta) {
            InventarioItem insumo = ri.getInventarioItem();
            double consumo = ri.getCantidadUsada() * cantidadVendida;
            double nuevaCantidad = Math.max(0, insumo.getCantidadDisponible() - consumo);
            insumo.setCantidadDisponible(nuevaCantidad);
            inventarioItemRepository.save(insumo);
        }
    }

    private RecetaItemResponse mapToResponse(RecetaItem ri) {
        return new RecetaItemResponse(
                ri.getId(),
                ri.getProducto().getId(),
                ri.getProducto().getNombre(),
                ri.getInventarioItem().getId(),
                ri.getInventarioItem().getNombre(),
                ri.getCantidadUsada(),
                ri.getObservacion()
        );
    }
}
