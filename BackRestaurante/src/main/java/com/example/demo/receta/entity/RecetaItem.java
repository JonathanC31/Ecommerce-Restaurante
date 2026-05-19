package com.example.demo.receta.entity;

import com.example.demo.inventario.entity.InventarioItem;
import com.example.demo.model.entity.Producto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "receta_items")
@Getter
@Setter
@NoArgsConstructor
public class RecetaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inventario_item_id", nullable = false)
    private InventarioItem inventarioItem;

    /** Cantidad del insumo que se consume por UNIDAD vendida del producto */
    @Column(nullable = false)
    private double cantidadUsada;

    private String observacion;
}
