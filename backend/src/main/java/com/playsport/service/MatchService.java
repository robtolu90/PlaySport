package com.playsport.service;

import com.playsport.model.Match;
import com.playsport.model.User;
import com.playsport.repository.BookingRepository;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import com.playsport.repository.ArenaPlayHistoryRepository;
import com.playsport.model.ArenaPlayHistory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ArenaPlayHistoryRepository arenaPlayHistoryRepository;

    public MatchService(MatchRepository matchRepository, UserRepository userRepository, BookingRepository bookingRepository, ArenaPlayHistoryRepository arenaPlayHistoryRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.arenaPlayHistoryRepository = arenaPlayHistoryRepository;
    }

    @Transactional
    public Match create(Match m) {
        if (m.getVenue() != null && m.getVenue().getId() != null && m.getStartTime() != null && m.getFacility() != null && !m.getFacility().isBlank()) {
            var venueId = m.getVenue().getId();
            var start = m.getStartTime();
            var end = m.getEndTime() != null ? m.getEndTime() : m.getStartTime().plusHours(1);
            boolean matchExists = matchRepository.existsByVenue_IdAndFacilityAndStartTimeLessThanAndEndTimeGreaterThan(venueId, m.getFacility(), end, start);
            boolean bookingExists = bookingRepository.existsByVenueIdAndFacilityAndStartTimeLessThanAndEndTimeGreaterThan(venueId, m.getFacility(), end, start);
            if (matchExists || bookingExists) {
                throw new RuntimeException("Instalação já reservada para este horário");
            }
        }
        if (m.getOrganizer() != null && m.getOrganizer().getId() != null) {
            User organizer = userRepository.findById(m.getOrganizer().getId()).orElse(null);
            if (organizer != null && !m.getParticipants().contains(organizer)) {
                m.getParticipants().add(organizer);
            }
        }
        Match saved = matchRepository.save(m);
        if (saved.getOrganizer() != null && saved.getOrganizer().getId() != null && saved.getVenue() != null && saved.getVenue().getId() != null) {
            recordPlay(saved.getOrganizer().getId(), saved.getVenue().getId());
        }
        return saved;
    }

    @Transactional
    public Match join(Long matchId, Long userId) {
        Match m = matchRepository.findById(matchId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        if (m.getParticipants().contains(u)) {
            return m;
        }
        int size = m.getParticipants().size();
        if (m.getMaxPlayers() != null && size >= m.getMaxPlayers()) {
            throw new RuntimeException("Partida cheia");
        }
        m.getParticipants().add(u);
        Match saved = matchRepository.save(m);
        if (saved.getVenue() != null && saved.getVenue().getId() != null) {
            recordPlay(userId, saved.getVenue().getId());
        }
        return saved;
    }

    @Transactional
    public Match leave(Long matchId, Long userId) {
        Match m = matchRepository.findById(matchId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        m.getParticipants().remove(u);
        return matchRepository.save(m);
    }

    private void recordPlay(Long userId, Long venueId) {
        ArenaPlayHistory existing = arenaPlayHistoryRepository.findByUserIdAndVenueId(userId, venueId).orElse(null);
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (existing == null) {
            ArenaPlayHistory h = new ArenaPlayHistory();
            h.setUser(userRepository.findById(userId).orElseThrow());
            h.setVenueId(venueId);
            h.setTimesPlayed(1);
            h.setLastPlayedAt(now);
            arenaPlayHistoryRepository.save(h);
        } else {
            existing.setTimesPlayed(existing.getTimesPlayed() + 1);
            existing.setLastPlayedAt(now);
            arenaPlayHistoryRepository.save(existing);
        }
    }
}
