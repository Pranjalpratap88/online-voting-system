package com.votingapp.dto.response;

import com.votingapp.entity.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private String id;
    private String name;
    private String party;
    private String description;
    private String email;
    private String phone;
    private String address;
    private Integer age;
    private String education;
    private String occupation;
    private String previousPositions;
    private String criminalRecord;
    private Integer assetsValue;
    private String photoUrl;
    private String affidavitUrl;
    private String nominationFormUrl;
    private CandidateStatus status;
    private String rejectionReason;
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
    private String approvedBy;
    private Boolean nominationFeePaid;
    private String nominationFeeReceiptNo;
    private LocalDateTime nominationFeeDate;
    private String electionId;
    private String citizenId;
}

