package com.votingapp.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CandidateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String party;

    private String description;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotNull(message = "Age is required")
    private Integer age;
    
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

    @NotBlank(message = "Election ID is required")
    private String electionId;
    
    private String citizenId; // Optional - if citizen is applying themselves
}

