package com.playsport.controller;

import com.playsport.model.Match;
import com.playsport.model.SportType;
import com.playsport.repository.MatchRepository;
import com.playsport.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchRepository matchRepository;
    private final MatchService matchService;

    public MatchController(MatchRepository matchRepository, MatchService matchService) {
        this.matchRepository = matchRepository;
        this.matchService = matchService;
    }

    @PostMapping
    public Match create(@RequestBody Match match) {
        return matchService.create(match);
    }

    @GetMapping
    public List<Match> list(@RequestParam(required = false) SportType sport,
                            @RequestParam(required = false) LocalDate from,
                            @RequestParam(required = false) LocalDate to) {
        LocalDateTime f = from != null ? from.atStartOfDay() : null;
        LocalDateTime t = to != null ? to.atTime(23, 59, 59) : null;
        return matchRepository.search(sport, f, t);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> get(@PathVariable Long id) {
        return matchRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Match> join(@PathVariable Long id, @RequestParam Long userId) {
        try {
            return ResponseEntity.ok(matchService.join(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Match> leave(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(matchService.leave(id, userId));
    }
}
