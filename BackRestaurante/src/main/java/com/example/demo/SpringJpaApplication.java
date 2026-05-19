package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class SpringJpaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringJpaApplication.class, args);
	}

    @Bean
    public CommandLineRunner run(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE ventas MODIFY COLUMN estado VARCHAR(255)");
                System.out.println("Columna 'estado' en la tabla 'ventas' actualizada a VARCHAR(255)");
            } catch (Exception e) {
                System.out.println("No se pudo alterar la tabla: " + e.getMessage());
            }
        };
    }
}
