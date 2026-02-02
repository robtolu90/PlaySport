package com.playsport.service;

import com.playsport.model.User;
import com.playsport.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Key key;
    private final long expirationMs;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${security.jwt.secret}") String secret,
                       @Value("${security.jwt.expiration}") long expirationMs) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    public User register(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já cadastrado");
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password));
        return userRepository.save(u);
    }

    public Optional<AuthResult> login(String email, String password) {
        return userRepository.findByEmail(email).flatMap(u -> {
            if (passwordEncoder.matches(password, u.getPasswordHash())) {
                String token = Jwts.builder()
                        .setSubject(String.valueOf(u.getId()))
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                        .signWith(key, SignatureAlgorithm.HS256)
                        .compact();
                return Optional.of(new AuthResult(u, token));
            }
            return Optional.empty();
        });
    }

    public static class AuthResult {
        private final User user;
        private final String token;
        public AuthResult(User user, String token) { this.user = user; this.token = token; }
        public User getUser() { return user; }
        public String getToken() { return token; }
    }
}
