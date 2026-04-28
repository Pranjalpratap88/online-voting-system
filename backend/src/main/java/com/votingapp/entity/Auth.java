package com.votingapp.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Auth document — handles login credentials separately from citizen identity.
 */
@Document(collection = "auth")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auth {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    /** Nullable — OTP-only users never set a password */
    private String password;

    private Role role;

    /** Reference to Citizen.id */
    private String citizenId;

    @Builder.Default
    private boolean isEmailVerified = false;

    /** Only relevant for ELECTION_MANAGER — must be approved by ADMIN */
    @Builder.Default
    private boolean isApproved = false;

    @Builder.Default
    private boolean passwordSet = false;

    // OTP fields
    private String otp;
    private LocalDateTime otpExpiry;

    // Password reset fields
    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiry;
}
