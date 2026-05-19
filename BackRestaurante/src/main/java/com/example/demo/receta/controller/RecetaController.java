package com.example.demo.receta.controller;

import com.example.demo.receta.dto.RecetaItemRequest;
import com.example.demo.receta.dto.RecetaItemResponse;
import com.example.demo.receta.service.RecetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recetas")
@CrossOrigin("http://localhost:4200")
public class RecetaController {

    private final RecetaService recetaService;

    public RecetaController(RecetaService recetaService) {
        this.recetaService = recetaService;
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<RecetaItemResponse>> getReceta(@PathVariable Long productoId) {
        return ResponseEntity.ok(recetaService.getRecetaByProducto(productoId));
    }

    @PutMapping("/producto/{productoId}")
    public ResponseEntity<List<RecetaItemResponse>> guardarReceta(
            @PathVariable Long productoId,
            @RequestBody List<RecetaItemRequest> items
    ) {
        return ResponseEntity.ok(recetaService.guardarReceta(productoId, items));
    }

    @DeleteMapping("/producto/{productoId}")
    public ResponseEntity<Void> eliminarReceta(@PathVariable Long productoId) {
        recetaService.eliminarReceta(productoId);
        return ResponseEntity.noContent().build();
    }
}
