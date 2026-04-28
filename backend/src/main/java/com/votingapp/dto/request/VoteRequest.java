package com.votingapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VoteRequest {

    @NotBlank
    private String electionId;

    @NotBlank
    private String candidateId;
}
