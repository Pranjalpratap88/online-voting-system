package com.votingapp.dto.request;

import com.votingapp.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String name;

    @Min(18)
    @Max(120)
    private int age;

    @NotBlank
    private String gender;

    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String address;

    @NotBlank
    @Size(min = 12, max = 12, message = "Aadhaar ID must be 12 digits")
    @Pattern(regexp = "\\d{12}", message = "Aadhaar ID must be numeric")
    private String aadhaarId;

    /** Optional — OTP users won't have a password */
    private String password;

    /** CITIZEN or ELECTION_MANAGER */
    private Role role = Role.CITIZEN;
}
