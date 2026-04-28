package com.votingapp.controller;

import com.votingapp.dto.request.ForgotPasswordRequest;
import com.votingapp.dto.request.LoginRequest;
import com.votingapp.dto.request.OtpRequest;
import com.votingapp.dto.request.RegisterRequest;
import com.votingapp.dto.request.ResetPasswordRequest;
import com.votingapp.dto.request.SendOtpRequest;
import com.votingapp.dto.request.ChangePasswordRequest;
import com.votingapp.dto.request.SetupPasswordRequest;
import com.votingapp.dto.response.AuthResponse;
import com.votingapp.service.AuthService;
import com.votingapp.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok("OTP sent successfully to " + request.getEmail());
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    /**
     * Sends a password reset link to the provided email.
     * Always returns 200 OK to prevent email enumeration attacks.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("If an account with that email exists, a password reset link has been sent.");
    }

    /**
     * Validates the reset token and sets a new password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password has been reset successfully. You can now log in.");
    }

    /**
     * Allows authenticated user to change their password.
     * Requires current password verification.
     */
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        // Extract email from JWT token
        String email = jwtUtil.extractUsername(token.substring(7));
        authService.changePassword(email, request);
        return ResponseEntity.ok("Password changed successfully");
    }

    /**
     * Allows pre-registered users (OTP login) to set their initial password.
     * Does NOT require current password verification.
     */
    @PostMapping("/setup-password")
    public ResponseEntity<String> setupPassword(
            @RequestHeader(value = "Authorization", required = false) String token,
            @Valid @RequestBody SetupPasswordRequest request) {
        
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Authorization token is required");
        }
        // Extract email from JWT token
        String email = jwtUtil.extractUsername(token.substring(7));
        authService.setupPassword(email, request);
        return ResponseEntity.ok("Password set successfully");
    }
}

