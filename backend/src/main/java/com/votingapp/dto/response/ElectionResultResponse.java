package com.votingapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResultResponse {
    private String electionId;
    private String electionTitle;
    private long totalVotes;
    private List<CandidateResult> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateResult {
        private String candidateId;
        private String candidateName;
        private String party;
        private long voteCount;
        private double percentage;
    }
}
