package com.playsport.controller;

import com.playsport.model.Invite;
import com.playsport.repository.InviteRepository;
import com.playsport.repository.MatchRepository;
import com.playsport.repository.UserRepository;
import com.playsport.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invites")
public class InviteController {
    private final InviteRepository inviteRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MatchService matchService;

    public InviteController(InviteRepository inviteRepository, MatchRepository matchRepository, UserRepository userRepository, MatchService matchService) {
        this.inviteRepository = inviteRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.matchService = matchService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestParam Long matchId, @RequestParam Long inviterId, @RequestParam Long inviteeId) {
        Invite i = new Invite();
        i.setMatch(matchRepository.findById(matchId).orElseThrow());
        i.setInviter(userRepository.findById(inviterId).orElseThrow());
        i.setInvitee(userRepository.findById(inviteeId).orElseThrow());
        i.setStatus(Invite.Status.PENDING);
        return ResponseEntity.ok(inviteRepository.save(i));
    }

    @GetMapping("/pending/{userId}")
    public List<Invite> pending(@PathVariable Long userId) {
        return inviteRepository.findByInvitee_IdAndStatus(userId, Invite.Status.PENDING);
    }

    @GetMapping("/sent/{userId}")
    public List<Invite> sent(@PathVariable Long userId) {
        return inviteRepository.findByInviter_Id(userId);
    }

    @GetMapping("/received/{userId}")
    public List<Invite> received(@PathVariable Long userId) {
        return inviteRepository.findByInvitee_Id(userId);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Long id) {
        Invite i = inviteRepository.findById(id).orElseThrow();
        i.setStatus(Invite.Status.ACCEPTED);
        inviteRepository.save(i);
        matchService.join(i.getMatch().getId(), i.getInvitee().getId());
        return ResponseEntity.ok(i);
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<?> decline(@PathVariable Long id) {
        Invite i = inviteRepository.findById(id).orElseThrow();
        i.setStatus(Invite.Status.DECLINED);
        return ResponseEntity.ok(inviteRepository.save(i));
    }
}
