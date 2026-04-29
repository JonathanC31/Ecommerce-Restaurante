package com.example.demo.model.repository;


import com.example.demo.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//Comunica y establece la relacion entre la ientidad y el servicio.

@Repository
public interface IProductosRepository extends JpaRepository<Producto, Long> {

}
