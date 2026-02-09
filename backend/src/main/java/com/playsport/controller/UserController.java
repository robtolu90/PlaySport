package com.playsport.controller;

import com.playsport.model.Match;
import com.playsport.model.User;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    public UserController(UserRepository userRepository, MatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public List<UserSummary> list(@RequestParam(required = false) String query) {
        List<User> all = userRepository.findAll();
        return all.stream()
                .filter(u -> query == null || query.isBlank() || u.getName().toLowerCase().contains(query.toLowerCase()))
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getAvatarUrl()))
                .collect(Collectors.toList());
    }
    
    public static class UserSummary {
        public Long id;
        public String name;
        public String avatarUrl;
        public UserSummary(Long id, String name, String avatarUrl) {
            this.id = id;
            this.name = name;
            this.avatarUrl = avatarUrl;
        }
    }


    @GetMapping("/{id}/matches")
    public List<Match> myMatches(@PathVariable Long id) {
        return matchRepository.findForUser(id);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return userRepository.findById(id).map(u -> {
            if (payload.containsKey("name")) u.setName(String.valueOf(payload.get("name")));
            if (payload.containsKey("email")) u.setEmail(String.valueOf(payload.get("email")));
            if (payload.containsKey("avatarUrl")) u.setAvatarUrl(String.valueOf(payload.get("avatarUrl")));
            if (payload.containsKey("phoneNumber")) u.setPhoneNumber(String.valueOf(payload.get("phoneNumber")));
            if (payload.containsKey("city")) u.setCity(String.valueOf(payload.get("city")));
            return ResponseEntity.ok(userRepository.save(u));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
