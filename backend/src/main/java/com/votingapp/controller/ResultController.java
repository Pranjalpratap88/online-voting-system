package com.votingapp.controller;

import com.votingapp.dto.response.ElectionResultResponse;
import com.votingapp.entity.Candidate;
import com.votingapp.entity.Election;
import com.votingapp.entity.Vote;
import com.votingapp.exception.ResourceNotFoundException;
import com.votingapp.repository.CandidateRepository;
import com.votingapp.repository.ElectionRepository;
import com.votingapp.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    @GetMapping("/{electionId}")
    public ResponseEntity<ElectionResultResponse> getElectionResults(@PathVariable String electionId) {
        return buildResults(electionId);
    }

    // Alias: /api/elections/{id}/results (used by frontend ElectionResults page)
    @GetMapping("/election/{electionId}")
    public ResponseEntity<ElectionResultResponse> getElectionResultsAlias(@PathVariable String electionId) {
        return buildResults(electionId);
    }

    private ResponseEntity<ElectionResultResponse> buildResults(String electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        List<Vote> votes = voteRepository.findByElectionId(electionId);
        List<Candidate> candidates = candidateRepository.findByElectionId(electionId);

        Map<String, Long> voteCounts = votes.stream()
                .collect(Collectors.groupingBy(Vote::getCandidateId, Collectors.counting()));

        long totalVotes = votes.size();

        List<ElectionResultResponse.CandidateResult> results = candidates.stream().map(c -> {
            long count = voteCounts.getOrDefault(c.getId(), 0L);
            double percentage = totalVotes == 0 ? 0 : ((double) count / totalVotes) * 100.0;
            return ElectionResultResponse.CandidateResult.builder()
                    .candidateId(c.getId())
                    .candidateName(c.getName())
                    .party(c.getParty())
                    .voteCount(count)
                    .percentage(percentage)
                    .build();
        }).sorted((a, b) -> Long.compare(b.getVoteCount(), a.getVoteCount()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ElectionResultResponse.builder()
                .electionId(election.getId())
                .electionTitle(election.getTitle())
                .totalVotes(totalVotes)
                .results(results)
                .build());
    }
}
