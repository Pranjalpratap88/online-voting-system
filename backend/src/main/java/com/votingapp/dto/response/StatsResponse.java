package com.votingapp.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatsResponse {
    private long totalUsers;
    private long totalVotes;
    private long activeElections;
    private long totalElections;
}

