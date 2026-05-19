package com.example.demo.receta.repository;

import com.example.demo.receta.entity.RecetaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecetaItemRepository extends JpaRepository<RecetaItem, Long> {
    List<RecetaItem> findByProductoId(Long productoId);
    void deleteByProductoId(Long productoId);
}
