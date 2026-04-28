package com.votingapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CitizenNominationRequest {
    
    @NotBlank(message = "Election ID is required")
    private String electionId;
    
    private String party; // Optional - can be Independent
    
    @NotBlank(message = "Manifesto is required")
    private String manifesto;
    
    private String education;
    private String occupation;
    private String previousPositions;
    
    @NotBlank(message = "Criminal record status is required")
    private String criminalRecord; // "NONE", "PENDING_CASES", "CONVICTED"
    
    private Integer assetsValue;
    
    // Document URLs (uploaded separately)
    private String photoUrl;
    private String affidavitUrl;
    private String nominationFormUrl;
    
    // Nomination fee details
    private Boolean nominationFeePaid;
    private String nominationFeeReceiptNo;
}
