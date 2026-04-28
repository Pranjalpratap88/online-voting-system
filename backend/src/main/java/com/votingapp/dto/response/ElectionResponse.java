package com.votingapp.dto.response;

import com.votingapp.entity.ElectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResponse {
    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ElectionStatus status;
    private String createdBy;
    private boolean allEligible;
    private String eligibilityMode;   // "ALL", "INVITE", "SPECIFIC"
    private List<String> eligibleCitizenIds;
    private String inviteToken;
    private boolean hasVoted;
    private int candidateCount;
    private int totalVotes;
    private List<CandidateResponse> candidates;
}
