package com.playsport.controller;

import com.playsport.model.ArenaPlayHistory;
import com.playsport.model.User;
import com.playsport.repository.ArenaPlayHistoryRepository;
import com.playsport.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/arenas")
public class ArenaHistoryController {
    private final ArenaPlayHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public ArenaHistoryController(ArenaPlayHistoryRepository historyRepository, UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{venueId}/players")
    public List<UserSummary> players(@PathVariable Long venueId) {
        List<ArenaPlayHistory> list = historyRepository.findByVenueIdOrderByLastPlayedAtDesc(venueId);
        return list.stream().map(h -> {
            User u = h.getUser();
            return new UserSummary(u.getId(), u.getName(), u.getAvatarUrl(), h.getTimesPlayed(), h.getLastPlayedAt());
        }).collect(Collectors.toList());
    }

    public static class UserSummary {
        public Long id;
        public String name;
        public String avatarUrl;
        public Integer timesPlayed;
        public java.time.LocalDateTime lastPlayedAt;
        public UserSummary(Long id, String name, String avatarUrl, Integer timesPlayed, java.time.LocalDateTime lastPlayedAt) {
            this.id = id;
            this.name = name;
            this.avatarUrl = avatarUrl;
            this.timesPlayed = timesPlayed;
            this.lastPlayedAt = lastPlayedAt;
        }
    }
}
