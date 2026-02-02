package com.playsport.repository;

import com.playsport.model.Booking;
import com.playsport.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("select b from Booking b where b.venue = :venue and ((b.startTime < :end and b.endTime > :start))")
    List<Booking> findOverlapping(@Param("venue") Venue venue, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    List<Booking> findByUserId(Long userId);
}
