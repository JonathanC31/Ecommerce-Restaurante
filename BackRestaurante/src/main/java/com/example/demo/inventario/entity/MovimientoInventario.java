package com.example.demo.inventario.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario")
@Getter
@Setter
@NoArgsConstructor
public class MovimientoInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private InventarioItem item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimientoInventario tipo;

    @Column(nullable = false)
    private double cantidad;

    @Column(nullable = false)
    private double cantidadAnterior;

    @Column(nullable = false)
    private double cantidadNueva;

    private double costoUnitario;

    private String motivo;

    private String observacion;

    @Column(nullable = false)
    private LocalDateTime fecha;

}
