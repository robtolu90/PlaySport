package com.playsport.service;

import com.playsport.model.Booking;
import com.playsport.model.Venue;
import com.playsport.repository.BookingRepository;
import com.playsport.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;

    public BookingService(BookingRepository bookingRepository, VenueRepository venueRepository) {
        this.bookingRepository = bookingRepository;
        this.venueRepository = venueRepository;
    }

    @Transactional
    public Booking create(Booking booking) {
        Venue v = venueRepository.findById(booking.getVenue().getId()).orElseThrow();
        List<Booking> overlaps = bookingRepository.findOverlapping(v, booking.getStartTime(), booking.getEndTime());
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Horário indisponível");
        }
        booking.setVenue(v);
        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }
}
