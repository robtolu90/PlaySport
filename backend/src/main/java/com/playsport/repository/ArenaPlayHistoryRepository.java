package com.playsport.repository;

import com.playsport.model.ArenaPlayHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArenaPlayHistoryRepository extends JpaRepository<ArenaPlayHistory, Long> {
    Optional<ArenaPlayHistory> findByUserIdAndVenueId(Long userId, Long venueId);
    List<ArenaPlayHistory> findByVenueIdOrderByLastPlayedAtDesc(Long venueId);
}
