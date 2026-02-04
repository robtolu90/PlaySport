package com.playsport.controller;

import com.playsport.model.Match;
import com.playsport.model.SportType;
import com.playsport.repository.MatchRepository;
import com.playsport.service.MatchService;
import org.springframework.format.annotation.DateTimeFormat;
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
    public ResponseEntity<?> create(@RequestBody Match match) {
        try {
            return ResponseEntity.ok(matchService.create(match));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<Match> list(@RequestParam(required = false) SportType sport,
                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDateTime f = from != null ? from.atStartOfDay() : null;
        LocalDateTime t = to != null ? to.atTime(23, 59, 59) : null;
        if (sport == null && f == null && t == null) {
            return matchRepository.findAllWithParticipants();
        }
        if (sport != null && f == null && t == null) {
            return matchRepository.findBySportWithParticipants(sport);
        }
        if (sport == null && f != null && t == null) {
            return matchRepository.findByStartTimeAfterWithParticipants(f);
        }
        if (sport == null && f == null && t != null) {
            return matchRepository.findByStartTimeBeforeWithParticipants(t);
        }
        if (sport == null && f != null && t != null) {
            return matchRepository.findByStartTimeBetweenWithParticipants(f, t);
        }
        if (sport != null && f != null && t != null) {
            return matchRepository.findBySportAndStartTimeBetweenWithParticipants(sport, f, t);
        }
        if (sport != null && f != null) {
            return matchRepository.findBySportAndStartTimeAfterWithParticipants(sport, f);
        }
        return matchRepository.findBySportAndStartTimeBeforeWithParticipants(sport, t);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> get(@PathVariable Long id) {
        return matchRepository.findByIdWithParticipants(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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
