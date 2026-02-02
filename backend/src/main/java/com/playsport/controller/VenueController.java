package com.playsport.controller;

import com.playsport.model.SportType;
import com.playsport.model.Venue;
import com.playsport.repository.VenueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
    private final VenueRepository venueRepository;

    public VenueController(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @PostMapping
    public Venue create(@RequestBody Venue venue) {
        return venueRepository.save(venue);
    }

    @GetMapping
    public List<Venue> list(@RequestParam(required = false) String city,
                            @RequestParam(required = false) SportType sport) {
        return venueRepository.search(city, sport);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> get(@PathVariable Long id) {
        return venueRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
