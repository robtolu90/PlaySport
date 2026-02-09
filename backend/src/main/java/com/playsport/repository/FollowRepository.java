package com.playsport.repository;

import com.playsport.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollower_IdAndFollowee_Id(Long followerId, Long followeeId);
    void deleteByFollower_IdAndFollowee_Id(Long followerId, Long followeeId);
    List<Follow> findByFollowee_Id(Long userId);
    List<Follow> findByFollower_Id(Long userId);
}
