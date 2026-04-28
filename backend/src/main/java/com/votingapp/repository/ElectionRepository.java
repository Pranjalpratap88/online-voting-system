package com.votingapp.repository;

import com.votingapp.entity.Election;
import com.votingapp.entity.ElectionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ElectionRepository extends MongoRepository<Election, String> {
    List<Election> findByStatus(ElectionStatus status);
    List<Election> findByEligibleCitizenIdsContaining(String citizenId);
    List<Election> findByCreatedBy(String createdBy);
    List<Election> findByAllEligibleTrue();
    Optional<Election> findByInviteToken(String inviteToken);
}
