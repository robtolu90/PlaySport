package com.playsport.controller;

import com.playsport.model.Booking;
import com.playsport.repository.BookingRepository;
import com.playsport.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public BookingController(BookingRepository bookingRepository, BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        try {
            return ResponseEntity.ok(bookingService.create(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<Booking> byUser(@RequestParam Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}
