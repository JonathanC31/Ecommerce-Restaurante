package com.example.demo.ventas.repository;

import com.example.demo.ventas.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findByFechaBetweenOrderByFechaDesc(
            LocalDateTime desde,
            LocalDateTime hasta
    );
}