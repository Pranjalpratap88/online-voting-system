package com.votingapp.service;

import com.votingapp.dto.request.LoginRequest;
import com.votingapp.dto.request.OtpRequest;
import com.votingapp.dto.request.RegisterRequest;
import com.votingapp.dto.request.SendOtpRequest;
import com.votingapp.dto.request.ForgotPasswordRequest;
import com.votingapp.dto.request.ResetPasswordRequest;
import com.votingapp.dto.response.AuthResponse;
import com.votingapp.entity.Auth;
import com.votingapp.entity.Citizen;
import com.votingapp.entity.Role;
import com.votingapp.repository.AuthRepository;
import com.votingapp.repository.CitizenRepository;
import com.votingapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendBaseUrl;

    public void sendOtp(SendOtpRequest request) {
        String email = request.getEmail();
        
        // Find if user exists in Citizen collection (could be imported via CSV)
        Citizen citizen = citizenRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found in our records. Please register."));

        // Find or create Auth record
        Auth auth = authRepository.findByEmail(email)
                .orElseGet(() -> Auth.builder()
                        .email(email)
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.CITIZEN)
                        .citizenId(citizen.getId())
                        .isEmailVerified(false)
                        .isApproved(true)
                        .passwordSet(false)
                        .build());

        String otp = String.format("%06d", new Random().nextInt(1000000));
        auth.setOtp(otp);
        auth.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        authRepository.save(auth);

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to send OTP email to " + email + ". Error: " + e.getMessage());
            // In a real production app, we might retry or notify admin.
            // For now, we continue so the user flow isn't hard-blocked by SMTP issues.
        }
    }

    public AuthResponse verifyOtp(OtpRequest request) {
        Auth auth = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (auth.getOtp() == null || !auth.getOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        if (auth.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired");
        }

        auth.setEmailVerified(true);
        auth.setOtp(null);
        auth.setOtpExpiry(null);
        authRepository.save(auth);

        Citizen citizen = citizenRepository.findById(auth.getCitizenId())
                .orElseThrow(() -> new IllegalArgumentException("Citizen record missing"));
        
        citizen.setVerified(true);
        citizenRepository.save(citizen);

        return generateAuthResponse(auth, citizen);
    }

    public AuthResponse login(LoginRequest request) {
        Auth auth = authRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    // Check if citizen exists in records (imported via CSV)
                    Citizen citizen = citizenRepository.findByEmail(request.getEmail())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
                    
                    // Create on-demand Auth record with default password
                    Auth newAuth = Auth.builder()
                            .email(request.getEmail())
                            .password(passwordEncoder.encode("123456"))
                            .role(Role.CITIZEN)
                            .citizenId(citizen.getId())
                            .isEmailVerified(false)
                            .isApproved(true)
                            .passwordSet(false)
                            .build();
                    return authRepository.save(newAuth);
                });

        if (auth.getPassword() == null) {
            throw new IllegalArgumentException("Password not set. Please login with OTP.");
        }

        if (auth.getRole() == Role.ELECTION_MANAGER && !auth.isApproved()) {
            throw new IllegalArgumentException("Election Manager account pending admin approval.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Citizen citizen = citizenRepository.findById(auth.getCitizenId())
                .orElseThrow(() -> new IllegalArgumentException("Citizen record missing"));

        return generateAuthResponse(auth, citizen);
    }

    /**
     * Initiates the forgot-password flow.
     * Generates a secure reset token, stores it with a 30-minute expiry, and emails a reset link.
     * Always returns a generic success message to prevent email enumeration.
     */
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();

        // Silently succeed if email not found — prevents user enumeration
        Optional<Auth> authOpt = authRepository.findByEmail(email);
        if (authOpt.isEmpty()) {
            return;
        }

        Auth auth = authOpt.get();
        String resetToken = UUID.randomUUID().toString();
        auth.setPasswordResetToken(resetToken);
        auth.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        authRepository.save(auth);

        try {
            emailService.sendPasswordResetEmail(email, resetToken, frontendBaseUrl);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to send password reset email to " + email + ". Error: " + e.getMessage());
        }
    }

    /**
     * Validates the reset token and updates the password.
     */
    public void resetPassword(ResetPasswordRequest request) {
        Auth auth = authRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset link."));

        if (auth.getPasswordResetTokenExpiry() == null ||
                auth.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset link has expired. Please request a new one.");
        }

        auth.setPassword(passwordEncoder.encode(request.getNewPassword()));
        auth.setPasswordSet(true);
        auth.setEmailVerified(true);
        auth.setPasswordResetToken(null);
        auth.setPasswordResetTokenExpiry(null);
        authRepository.save(auth);
    }

    /**
     * Allows authenticated user to change their password.
     * Requires current password verification.
     */
    public void changePassword(String email, com.votingapp.dto.request.ChangePasswordRequest request) {
        Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), auth.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Verify new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        // Prevent using same password
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        // Update password
        auth.setPassword(passwordEncoder.encode(request.getNewPassword()));
        auth.setPasswordSet(true);
        authRepository.save(auth);
    }

    /**
     * Allows pre-registered users (OTP login) to set their initial password.
     * Does NOT require current password verification.
     */
    public void setupPassword(String email, com.votingapp.dto.request.SetupPasswordRequest request) {
        Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        // Validate password strength
        if (request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        // Update password
        auth.setPassword(passwordEncoder.encode(request.getNewPassword()));
        auth.setPasswordSet(true);
        authRepository.save(auth);
    }

    public AuthResponse register(RegisterRequest request) {
        if (citizenRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (citizenRepository.existsByAadhaarId(request.getAadhaarId())) {
            throw new IllegalArgumentException("Aadhaar ID already registered");
        }

        Citizen citizen = Citizen.builder()
                .voterId("V" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .name(request.getName())
                .age(request.getAge())
                .gender(request.getGender())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .aadhaarId(request.getAadhaarId())
                .createdSource(Citizen.CreatedSource.SELF_REGISTERED)
                .isVerified(false)
                .build();

        citizen = citizenRepository.save(citizen);

        Auth auth = Auth.builder()
                .email(request.getEmail())
                .password(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : null)
                .role(request.getRole())
                .citizenId(citizen.getId())
                .isEmailVerified(false)
                .isApproved(request.getRole() == Role.CITIZEN)
                .passwordSet(true)
                .build();

        authRepository.save(auth);

        // For registration, we might want to send OTP for email verification
        SendOtpRequest sendOtpRequest = new SendOtpRequest();
        sendOtpRequest.setEmail(request.getEmail());
        sendOtp(sendOtpRequest);

        return AuthResponse.builder()
                .user(AuthResponse.UserDto.builder()
                        .email(auth.getEmail())
                        .isVerified(false)
                        .build())
                .build();
    }

    private AuthResponse generateAuthResponse(Auth auth, Citizen citizen) {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                auth.getEmail(),
                auth.getPassword() != null ? auth.getPassword() : "",
                Collections.singletonList(() -> "ROLE_" + auth.getRole().name())
        );

        String token = jwtUtil.generateToken(userDetails, auth.getId(), auth.getRole().name(), auth.getCitizenId());

        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(auth.getId())
                        .name(citizen.getName())
                        .email(auth.getEmail())
                        .role(auth.getRole().name())
                        .citizenId(auth.getCitizenId())
                        .isVerified(auth.isEmailVerified())
                        .isApproved(auth.isApproved())
                        .needsPasswordSetup(!auth.isPasswordSet())
                        .build())
                .build();
    }
}
