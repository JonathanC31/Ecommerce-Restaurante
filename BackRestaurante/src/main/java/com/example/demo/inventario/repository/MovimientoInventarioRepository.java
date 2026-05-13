package com.example.demo.inventario.repository;

import com.example.demo.inventario.entity.MovimientoInventario;
import com.example.demo.inventario.entity.TipoMovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    
    List<MovimientoInventario> findByOrderByFechaDesc();

    @Query("SELECT m FROM MovimientoInventario m WHERE m.tipo = :tipo AND m.fecha >= :inicioMes")
    List<MovimientoInventario> findByTipoAndFechaAfter(TipoMovimientoInventario tipo, LocalDateTime inicioMes);
}
