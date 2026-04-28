package com.votingapp.repository;

import com.votingapp.entity.Vote;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends MongoRepository<Vote, String> {
    List<Vote> findByElectionId(String electionId);
    List<Vote> findByCitizenId(String citizenId);
    Optional<Vote> findByCitizenIdAndElectionId(String citizenId, String electionId);
    boolean existsByCitizenIdAndElectionId(String citizenId, String electionId);
    void deleteByElectionId(String electionId);
    long countByElectionId(String electionId);
}
