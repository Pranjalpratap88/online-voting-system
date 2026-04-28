package com.votingapp.repository;

import com.votingapp.entity.Candidate;
import com.votingapp.entity.CandidateStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends MongoRepository<Candidate, String> {
    List<Candidate> findByElectionId(String electionId);
    List<Candidate> findByStatus(CandidateStatus status);
    List<Candidate> findByElectionIdAndStatus(String electionId, CandidateStatus status);
    void deleteByElectionId(String electionId);
    
    // Check if citizen already applied for this election
    Optional<Candidate> findByElectionIdAndCitizenId(String electionId, String citizenId);
    
    // Check if citizen has any pending or approved application for this election
    Optional<Candidate> findByElectionIdAndCitizenIdAndStatusIn(String electionId, String citizenId, List<CandidateStatus> statuses);
}

