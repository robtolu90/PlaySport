package com.playsport.repository;

import com.playsport.model.Invite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InviteRepository extends JpaRepository<Invite, Long> {
    List<Invite> findByInvitee_IdAndStatus(Long inviteeId, Invite.Status status);
    List<Invite> findByInviter_Id(Long inviterId);
    List<Invite> findByInvitee_Id(Long inviteeId);
}
