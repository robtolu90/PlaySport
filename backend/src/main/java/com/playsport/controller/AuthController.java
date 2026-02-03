package com.playsport.controller;

import com.playsport.model.User;
import com.playsport.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public static class RegisterRequest {
        @NotBlank public String name;
        @Email public String email;
        @NotBlank public String password;
    }
    public static class LoginRequest {
        @Email public String email;
        @NotBlank public String password;
    }

    public static class AuthResponse {
        public Long id; public String name; public String email; public String token; public Set<String> roles;
        public AuthResponse(Long id, String name, String email, String token, Set<String> roles) { 
            this.id = id; this.name = name; this.email = email; this.token = token; this.roles = roles; 
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        User u = authService.register(req.name, req.email, req.password);
        var login = authService.login(req.email, req.password).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(u.getId(), u.getName(), u.getEmail(), login.getToken(), u.getRoles()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return authService.login(req.email, req.password)
                .map(r -> ResponseEntity.ok(new AuthResponse(r.getUser().getId(), r.getUser().getName(), r.getUser().getEmail(), r.getToken(), r.getUser().getRoles())))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
