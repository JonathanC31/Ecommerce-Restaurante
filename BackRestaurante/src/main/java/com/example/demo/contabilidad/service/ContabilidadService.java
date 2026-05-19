package com.example.demo.contabilidad.service;

import com.example.demo.contabilidad.dto.EgresoResponse;
import com.example.demo.contabilidad.entity.Egreso;
import com.example.demo.contabilidad.repository.EgresoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContabilidadService {

    private final EgresoRepository egresoRepository;

    public ContabilidadService(EgresoRepository egresoRepository) {
        this.egresoRepository = egresoRepository;
    }

    @Transactional
    public Egreso registrarEgreso(String descripcion, double monto, String categoria, Long referenciaId) {
        if (monto <= 0) return null;
        
        Egreso egreso = new Egreso();
        egreso.setDescripcion(descripcion);
        egreso.setMonto(monto);
        egreso.setFecha(LocalDateTime.now());
        egreso.setCategoria(categoria);
        egreso.setReferenciaId(referenciaId);
        
        return egresoRepository.save(egreso);
    }

    public List<EgresoResponse> listarEgresos() {
        return egresoRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private EgresoResponse mapToResponse(Egreso egreso) {
        return new EgresoResponse(
            egreso.getId(),
            egreso.getDescripcion(),
            egreso.getMonto(),
            egreso.getFecha(),
            egreso.getCategoria(),
            egreso.getReferenciaId()
        );
    }
}
