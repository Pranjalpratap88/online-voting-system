package com.votingapp.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * One vote per citizen per election enforced by compound unique index.
 */
@Document(collection = "votes")
@CompoundIndex(name = "citizen_election_unique", def = "{'citizenId': 1, 'electionId': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {

    @Id
    private String id;

    private String citizenId;
    private String electionId;
    private String candidateId;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
