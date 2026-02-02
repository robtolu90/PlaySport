package com.playsport.service;

import com.playsport.model.Match;
import com.playsport.model.User;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MatchService(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Match create(Match m) {
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
