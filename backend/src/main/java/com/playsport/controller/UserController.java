package com.playsport.controller;

import com.playsport.model.Match;
import com.playsport.model.User;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    public UserController(UserRepository userRepository, MatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
    }

    @GetMapping("/{id}/matches")
    public List<Match> myMatches(@PathVariable Long id) {
        return matchRepository.findForUser(id);
    }
}
