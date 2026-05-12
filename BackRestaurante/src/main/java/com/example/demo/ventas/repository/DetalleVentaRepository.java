package com.example.demo.ventas.repository;

import com.example.demo.ventas.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    @Query("""
            select d.nombreProducto, sum(d.cantidad), sum(d.subtotal)
            from DetalleVenta d
            group by d.nombreProducto
            order by sum(d.cantidad) desc
            """)
    List<Object[]> productosMasVendidos();
}