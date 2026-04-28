package com.votingapp.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    private String id;

    private String name;
    private String party;
    private String description;
    
    // Contact Information
    private String email;
    private String phone;
    private String address;
    
    // Candidate Details
    private Integer age;
    private String education;
    private String occupation;
    
    // Political Background
    private String previousPositions; // Previous political positions held
    private String criminalRecord; // "NONE", "PENDING_CASES", "CONVICTED"
    private Integer assetsValue; // In lakhs/thousands
    
    // Documents (URLs or file paths)
    private String photoUrl;
    private String affidavitUrl;
    private String nominationFormUrl;
    
    // Approval Workflow
    private CandidateStatus status; // PENDING, APPROVED, REJECTED
    private String rejectionReason;
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
    private String approvedBy; // Admin/Manager who approved
    
    // Nomination Details
    private Boolean nominationFeePaid;
    private String nominationFeeReceiptNo;
    private LocalDateTime nominationFeeDate;

    /** Reference to Election.id */
    private String electionId;
    
    /** Reference to Citizen.id (who is contesting) */
    private String citizenId;
}
