package com.playsport.controller;

import com.playsport.model.Booking;
import com.playsport.model.User;
import com.playsport.model.Venue;
import com.playsport.repository.BookingRepository;
import com.playsport.repository.UserRepository;
import com.playsport.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/venue/{venueId}")
    public List<Booking> getBookings(@PathVariable Long venueId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        return bookingRepository.findByVenueIdAndStartTimeBetween(venueId, start, end);
    }
 
    @GetMapping("/venue/{venueId}/recent")
    public List<Booking> getRecentBookings(@PathVariable Long venueId, @RequestParam(defaultValue = "5") int limit) {
        return bookingRepository.findByVenueIdOrderByCreatedAtDesc(venueId, org.springframework.data.domain.PageRequest.of(0, Math.max(1, Math.min(limit, 20))));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> payload) {
        Long venueId = Long.parseLong(payload.get("venueId").toString());
        Long userId = Long.parseLong(payload.get("userId").toString());
        String startTimeStr = payload.get("startTime").toString(); // ISO format
        String facility = payload.get("facility") != null ? payload.get("facility").toString() : null;
        LocalDateTime startTime = LocalDateTime.parse(startTimeStr);
        LocalDateTime endTime = startTime.plusHours(1); // Assume 1 hour slots for now

        // Check availability (per facility if provided)
        boolean exists = facility != null && !facility.isBlank()
                ? bookingRepository.existsByVenueIdAndFacilityAndStartTimeLessThanAndEndTimeGreaterThan(venueId, facility, endTime, startTime)
                : bookingRepository.existsByVenueIdAndStartTimeLessThanAndEndTimeGreaterThan(venueId, endTime, startTime);
        if (exists) {
            return ResponseEntity.badRequest().body("Slot already booked");
        }

        Venue venue = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setVenue(venue);
        booking.setUser(user);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setPrice(venue.getHourlyRate());
        booking.setStatus("CONFIRMED");
        booking.setFacility(facility);

        return ResponseEntity.ok(bookingRepository.save(booking));
    }
    
    @DeleteMapping("/reset")
    public ResponseEntity<?> resetBookings() {
        bookingRepository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
