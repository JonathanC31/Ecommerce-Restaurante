package com.example.demo.inventario.repository;

import com.example.demo.inventario.entity.InventarioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventarioItemRepository extends JpaRepository<InventarioItem, Long> {
    List<InventarioItem> findByActivoTrue();
}
