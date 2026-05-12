package com.example.demo.ventas.repository;

import com.example.demo.ventas.entity.Factura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    Optional<Factura> findByVentaId(Long ventaId);
}