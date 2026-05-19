package com.example.demo.ventas.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class DatosEntrega {
    private String barrioEntrega;
    private String descripcionUbicacion;
    private String indicacionesEntrega;
}
