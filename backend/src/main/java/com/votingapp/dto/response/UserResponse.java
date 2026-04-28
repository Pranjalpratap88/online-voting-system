package com.votingapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String citizenId;
    private boolean isVerified;
    private boolean isApproved;
    private String voterId;
    private String phone;
    private String address;
    private String state;
    private String pincode;
    private String aadhaarId;
}
