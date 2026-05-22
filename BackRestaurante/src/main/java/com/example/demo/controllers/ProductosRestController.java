package com.example.demo.controllers;

import com.example.demo.model.entity.Producto;
import com.example.demo.model.service.IProductosService;
import com.example.demo.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:4200")
public class ProductosRestController {

    @Autowired
    private IProductosService productosService;

    @Autowired
    private StorageService storageService;

    @PostMapping("/producto/{id}/imagen")
    public ResponseEntity<Producto> uploadImagen(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Optional<Producto> opt = productosService.findById(id);
            if (opt.isPresent()) {
                Producto producto = opt.get();
                String url = storageService.uploadFile(file);
                producto.setImagenUrl(url);
                productosService.save(producto);
                return ResponseEntity.ok(producto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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





