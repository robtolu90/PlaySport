package com.playsport.repository;

import com.playsport.model.SportType;
import com.playsport.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findBySportType(SportType sportType);

    @Query("select v from Venue v where (:city is null or lower(v.city) like lower(concat('%', :city, '%'))) and (:sport is null or v.sportType = :sport)")
    List<Venue> search(@Param("city") String city, @Param("sport") SportType sport);
}
