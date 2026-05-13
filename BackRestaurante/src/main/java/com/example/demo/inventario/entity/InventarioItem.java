package com.example.demo.inventario.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "inventario_items")
@Getter
@Setter
@NoArgsConstructor
public class InventarioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnidadMedida unidadMedida;

    @Column(nullable = false)
    private double cantidadDisponible;

    @Column(nullable = false)
    private double stockMinimo;

    private double costoUnitario;

    private LocalDate fechaVencimiento;

    private String proveedor;

    @Column(nullable = false)
    private boolean activo = true;

    public boolean isBajoStock() {
        return this.cantidadDisponible <= this.stockMinimo;
    }
}
