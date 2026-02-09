package com.playsport.controller;

import com.playsport.model.Follow;
import com.playsport.model.User;
import com.playsport.repository.FollowRepository;
import com.playsport.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/social")
public class SocialController {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public SocialController(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/follow")
    public ResponseEntity<?> follow(@RequestParam Long followerId, @RequestParam Long followeeId) {
        if (followerId.equals(followeeId)) return ResponseEntity.badRequest().body("Cannot follow yourself");
        if (followRepository.existsByFollower_IdAndFollowee_Id(followerId, followeeId)) return ResponseEntity.ok().build();
        Follow f = new Follow();
        f.setFollower(userRepository.findById(followerId).orElseThrow());
        f.setFollowee(userRepository.findById(followeeId).orElseThrow());
        return ResponseEntity.ok(followRepository.save(f));
    }

    @DeleteMapping("/follow")
    public ResponseEntity<?> unfollow(@RequestParam Long followerId, @RequestParam Long followeeId) {
        followRepository.deleteByFollower_IdAndFollowee_Id(followerId, followeeId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/followers/{userId}")
    public List<UserSummary> followers(@PathVariable Long userId) {
        return followRepository.findByFollowee_Id(userId).stream().map(f -> {
            User u = f.getFollower();
            return new UserSummary(u.getId(), u.getName(), u.getAvatarUrl());
        }).collect(Collectors.toList());
    }

    @GetMapping("/following/{userId}")
    public List<UserSummary> following(@PathVariable Long userId) {
        return followRepository.findByFollower_Id(userId).stream().map(f -> {
            User u = f.getFollowee();
            return new UserSummary(u.getId(), u.getName(), u.getAvatarUrl());
        }).collect(Collectors.toList());
    }

    public static class UserSummary {
        public Long id;
        public String name;
        public String avatarUrl;
        public UserSummary(Long id, String name, String avatarUrl) {
            this.id = id;
            this.name = name;
            this.avatarUrl = avatarUrl;
        }
    }
}
