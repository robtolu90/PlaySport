package com.playsport.service;

import com.playsport.model.Match;
import com.playsport.model.User;
import com.playsport.repository.BookingRepository;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public MatchService(MatchRepository matchRepository, UserRepository userRepository, BookingRepository bookingRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
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
        return matchRepository.save(m);
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
        return matchRepository.save(m);
    }

    @Transactional
    public Match leave(Long matchId, Long userId) {
        Match m = matchRepository.findById(matchId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        m.getParticipants().remove(u);
        return matchRepository.save(m);
    }
}
