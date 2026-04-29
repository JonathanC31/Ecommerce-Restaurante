package com.example.demo.config;

import com.example.demo.model.entity.AppUser;
import com.example.demo.model.entity.Role;
import com.example.demo.model.repository.IRoleRepository;
import com.example.demo.model.repository.IUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final IRoleRepository roleRepository;
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            IRoleRepository roleRepository,
            IUserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

        roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role("USER")));

        if (!userRepository.existsByEmail("admin@restaurante.com")) {
            AppUser admin = new AppUser(
                    "Administrador",
                    "admin@restaurante.com",
                    passwordEncoder.encode("Admin12345")
            );

            admin.addRole(adminRole);

            userRepository.save(admin);
        }
    }
}