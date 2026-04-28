package com.votingapp.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "elections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Election {

    @Id
    private String id;

    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ElectionStatus status;

    /** Auth.id of the creator (ADMIN or ELECTION_MANAGER) */
    private String createdBy;

    /**
     * When true, ALL registered citizens are eligible to vote.
     * eligibleCitizenIds is ignored in this case.
     */
    @Builder.Default
    private boolean allEligible = false;

    /** List of Citizen.id values who are eligible to vote (used when allEligible=false) */
    @Builder.Default
    private List<String> eligibleCitizenIds = new ArrayList<>();

    /**
     * Unique token for shareable invite link.
     * Citizens who open the link and are registered can vote.
     */
    @Indexed(unique = true, sparse = true)
    private String inviteToken;
}
