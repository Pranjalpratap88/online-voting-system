package com.votingapp.repository;

import com.votingapp.entity.Citizen;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CitizenRepository extends MongoRepository<Citizen, String> {
    Optional<Citizen> findByEmail(String email);
    Optional<Citizen> findByVoterId(String voterId);
    boolean existsByEmail(String email);
    boolean existsByVoterId(String voterId);
    boolean existsByAadhaarId(String aadhaarId);
}
