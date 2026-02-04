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

    @Query("select distinct m from Match m " +
           "left join fetch m.participants p " +
           "left join fetch m.venue v " +
           "left join fetch m.organizer o " +
           "where (:sport is null or m.sportType = :sport) " +
           "and (:from is null or m.startTime >= :from) " +
           "and (:to is null or m.startTime <= :to)")
    List<Match> searchWithParticipants(@Param("sport") SportType sport, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o")
    List<Match> findAllWithParticipants();

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.sportType = :sport")
    List<Match> findBySportWithParticipants(@Param("sport") SportType sport);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.startTime >= :from")
    List<Match> findByStartTimeAfterWithParticipants(@Param("from") LocalDateTime from);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.startTime <= :to")
    List<Match> findByStartTimeBeforeWithParticipants(@Param("to") LocalDateTime to);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.startTime between :from and :to")
    List<Match> findByStartTimeBetweenWithParticipants(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.sportType = :sport and m.startTime between :from and :to")
    List<Match> findBySportAndStartTimeBetweenWithParticipants(@Param("sport") SportType sport, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.sportType = :sport and m.startTime >= :from")
    List<Match> findBySportAndStartTimeAfterWithParticipants(@Param("sport") SportType sport, @Param("from") LocalDateTime from);

    @Query("select distinct m from Match m left join fetch m.participants p left join fetch m.venue v left join fetch m.organizer o where m.sportType = :sport and m.startTime <= :to")
    List<Match> findBySportAndStartTimeBeforeWithParticipants(@Param("sport") SportType sport, @Param("to") LocalDateTime to);

    @Query("select distinct m from Match m left join m.participants p where m.organizer.id = :userId or p.id = :userId")
    List<Match> findForUser(@Param("userId") Long userId);

    @Query("select m from Match m " +
           "left join fetch m.participants p " +
           "left join fetch m.venue v " +
           "left join fetch m.organizer o " +
           "where m.id = :id")
    java.util.Optional<Match> findByIdWithParticipants(@Param("id") Long id);
    
    boolean existsByVenue_IdAndFacilityAndStartTimeLessThanAndEndTimeGreaterThan(Long venueId, String facility, LocalDateTime endTime, LocalDateTime startTime);
}
