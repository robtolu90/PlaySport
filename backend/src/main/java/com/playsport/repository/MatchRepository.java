package com.playsport.repository;

import com.playsport.model.Match;
import com.playsport.model.SportType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    @Query("select m from Match m where (:sport is null or m.sportType = :sport) and (:from is null or m.startTime >= :from) and (:to is null or m.startTime <= :to)")
    List<Match> search(@Param("sport") SportType sport, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("select distinct m from Match m left join m.participants p where m.organizer.id = :userId or p.id = :userId")
    List<Match> findForUser(@Param("userId") Long userId);
}
