package com.example.demo.controllers;

import com.example.demo.model.entity.Producto;
import com.example.demo.model.service.IProductosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200")
public class ProductosRestController {

    @Autowired
    private IProductosService productosService;

    @GetMapping("/producto")
    public List<Producto> findALL(){
        return productosService.findAll();
    }

    @GetMapping("/producto/{id}")
    public Optional<Producto> findById(@PathVariable Long id){
        return productosService.findById(id);
    }

    @PostMapping("/producto")
    public Producto save(@RequestBody Producto producto){
        return productosService.save(producto);}


    @PutMapping("/producto/{id}")
    public void update(@RequestBody Producto producto, @PathVariable Long id){
        productosService.update(producto, id);
    }


    @DeleteMapping("/producto/{id}")
    public void delete(@PathVariable Long id){
        productosService.delete(id);
    }
}





