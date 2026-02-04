package com.playsport.repository;

import com.playsport.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.playsport.model.Venue;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByVenueIdAndStartTimeBetween(Long venueId, LocalDateTime start, LocalDateTime end);
    boolean existsByVenueIdAndStartTimeLessThanAndEndTimeGreaterThan(Long venueId, LocalDateTime endTime, LocalDateTime startTime);
    boolean existsByVenueIdAndFacilityAndStartTimeLessThanAndEndTimeGreaterThan(Long venueId, String facility, LocalDateTime endTime, LocalDateTime startTime);

    @Query("SELECT b FROM Booking b WHERE b.venue = :venue AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findOverlapping(@Param("venue") Venue venue, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    List<Booking> findByVenueIdOrderByStartTimeDesc(Long venueId, Pageable pageable);
    List<Booking> findByVenueIdOrderByCreatedAtDesc(Long venueId, Pageable pageable);

    long countByVenueIdAndStartTimeBetween(Long venueId, LocalDateTime start, LocalDateTime end);
}
