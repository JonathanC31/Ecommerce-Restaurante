package com.example.demo.security;

import com.example.demo.model.entity.AppUser;
import com.example.demo.model.entity.Role;
import com.example.demo.model.repository.IRoleRepository;
import com.example.demo.model.repository.IUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public OAuth2LoginSuccessHandler(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            JwtService jwtService,
            @Lazy PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null) {
            response.sendRedirect("http://localhost:4200/login?error=email_not_found");
            return;
        }

        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("El rol USER no existe"));

            user = new AppUser(
                    name,
                    email,
                    passwordEncoder.encode(UUID.randomUUID().toString())
            );
            user.addRole(userRole);
            user = userRepository.save(user);
        }

        String jwtToken = jwtService.generateToken(user);

        response.sendRedirect("http://localhost:4200/login?token=" + jwtToken);
    }
}
