package com.votingapp.service;

import com.votingapp.dto.request.VoteRequest;
import com.votingapp.entity.Election;
import com.votingapp.entity.ElectionStatus;
import com.votingapp.entity.Vote;
import com.votingapp.exception.CitizenNotEligibleException;
import com.votingapp.exception.DuplicateVoteException;
import com.votingapp.exception.ElectionClosedException;
import com.votingapp.exception.ResourceNotFoundException;
import com.votingapp.repository.ElectionRepository;
import com.votingapp.repository.VoteRepository;
import com.votingapp.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    public void castVote(VoteRequest request, String citizenId) {
        Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        // Business Rules
        if (election.getStatus() == ElectionStatus.CLOSED) {
            throw new ElectionClosedException("Election is already closed");
        }
        
        if (election.getStatus() == ElectionStatus.UPCOMING) {
            throw new IllegalStateException("Election has not started yet");
        }

        if (!election.isAllEligible() && !election.getEligibleCitizenIds().contains(citizenId)) {
            throw new CitizenNotEligibleException("You are not eligible for this election");
        }

        if (voteRepository.existsByCitizenIdAndElectionId(citizenId, election.getId())) {
            throw new DuplicateVoteException("You have already voted in this election");
        }

        if (!candidateRepository.existsById(request.getCandidateId())) {
            throw new ResourceNotFoundException("Candidate not found");
        }

        Vote vote = Vote.builder()
                .citizenId(citizenId)
                .electionId(election.getId())
                .candidateId(request.getCandidateId())
                .timestamp(LocalDateTime.now())
                .build();

        voteRepository.save(vote);
    }
}
