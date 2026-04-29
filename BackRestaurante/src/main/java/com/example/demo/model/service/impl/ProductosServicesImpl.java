package com.example.demo.model.service.impl;

import com.example.demo.model.entity.Producto;
import com.example.demo.model.repository.IProductosRepository;
import com.example.demo.model.service.IProductosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ProductosServicesImpl implements IProductosService {

    @Autowired
    private IProductosRepository productosRepository;

    @Override
    public List<Producto> findAll() {
        return(List<Producto>) productosRepository.findAll();
    }

    @Override
    public Optional<Producto> findById(Long id) {
        return productosRepository.findById(id);
    }

    @Override
    public Producto save(Producto producto) {
        return productosRepository.save(producto);
    }

    @Override
    public void update(Producto producto, Long id) {
        Optional<Producto>us=productosRepository.findById(id);
        if(!us.isEmpty()){
            Producto productoUpdate=us.get();
            productoUpdate.setId(producto.getId());
            productoUpdate.setCategoria(producto.getCategoria());
            productoUpdate.setNombre(producto.getNombre());
            productoUpdate.setStock(producto.getStock());
            productoUpdate.setPrecioUnitario(producto.getPrecioUnitario());

            productosRepository.save(productoUpdate);
        }else {
            System.out.println("No existe el usuario");
        }
    }

    @Override
    public void delete(Long id) {
        productosRepository.deleteById(id);
    }
}
