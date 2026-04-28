package com.votingapp.controller;

import com.votingapp.entity.Citizen;
import com.votingapp.exception.ResourceNotFoundException;
import com.votingapp.repository.AuthRepository;
import com.votingapp.repository.CitizenRepository;
import com.votingapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Citizen> getCitizenProfile(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.extractUsername(token.substring(7));
        
        com.votingapp.entity.Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Citizen citizen = citizenRepository.findById(auth.getCitizenId())
                .orElseThrow(() -> new ResourceNotFoundException("Citizen profile not found"));
        
        return ResponseEntity.ok(citizen);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Citizen> updateCitizenProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody Citizen updatedCitizen) {
        
        String email = jwtUtil.extractUsername(token.substring(7));
        
        com.votingapp.entity.Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Citizen citizen = citizenRepository.findById(auth.getCitizenId())
                .orElseThrow(() -> new ResourceNotFoundException("Citizen profile not found"));
        
        // Update allowed fields
        if (updatedCitizen.getName() != null) citizen.setName(updatedCitizen.getName());
        if (updatedCitizen.getPhone() != null) citizen.setPhone(updatedCitizen.getPhone());
        if (updatedCitizen.getAddress() != null) citizen.setAddress(updatedCitizen.getAddress());
        if (updatedCitizen.getState() != null) citizen.setState(updatedCitizen.getState());
        if (updatedCitizen.getPincode() != null) citizen.setPincode(updatedCitizen.getPincode());
        if (updatedCitizen.getBio() != null) citizen.setBio(updatedCitizen.getBio());
        
        citizen = citizenRepository.save(citizen);
        return ResponseEntity.ok(citizen);
    }
}
