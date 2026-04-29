package com.example.demo.model.service;

import com.example.demo.model.entity.Producto;

import java.util.List;
import java.util.Optional;

public interface IProductosService {
    List<Producto> findAll();
    Optional<Producto>findById(Long id);
    Producto save(Producto producto);
    void update(Producto producto, Long id);
    void delete(Long id);

}
