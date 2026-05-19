package com.example.demo.ventas.repository;

import com.example.demo.ventas.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    Optional<Pago> findByTransaccionId(String transaccionId);
}
