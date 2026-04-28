package com.votingapp.service;

import com.votingapp.dto.request.CandidateRequest;
import com.votingapp.dto.request.ElectionRequest;
import com.votingapp.dto.response.*;
import com.votingapp.entity.*;
import com.votingapp.exception.ResourceNotFoundException;
import com.votingapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // ===== CITIZEN IMPORT (CSV) =====

    public Map<String, Object> importCitizens(MultipartFile file) {
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] data = line.split(",");
                try {
                    // name, age, gender, phone, email, address, aadhaarId
                    if (data.length < 7) throw new Exception("Invalid column count");

                    String email = data[4].trim();
                    if (citizenRepository.existsByEmail(email)) {
                        errors.add("Email " + email + " already exists");
                        failCount++;
                        continue;
                    }

                    Citizen citizen = Citizen.builder()
                            .voterId("V" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                            .name(data[0].trim())
                            .age(Integer.parseInt(data[1].trim()))
                            .gender(data[2].trim())
                            .phone(data[3].trim())
                            .email(email)
                            .address(data[5].trim())
                            .aadhaarId(data[6].trim())
                            .createdSource(Citizen.CreatedSource.CSV)
                            .isVerified(false)
                            .build();

                    citizen = citizenRepository.save(citizen);

                    // Create Auth record with default password "123456"
                    Auth auth = Auth.builder()
                            .email(email)
                            .password(passwordEncoder.encode("123456"))
                            .role(Role.CITIZEN)
                            .citizenId(citizen.getId())
                            .isEmailVerified(false)
                            .isApproved(true)
                            .passwordSet(false)
                            .build();
                    authRepository.save(auth);

                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    errors.add("Error processing line: " + line + " - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV: " + e.getMessage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("errors", errors);
        return result;
    }

    // ===== ELECTION MANAGER APPROVAL =====

    public void approveManager(String authId) {
        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new ResourceNotFoundException("Auth record not found"));
        if (auth.getRole() != Role.ELECTION_MANAGER) {
            throw new IllegalArgumentException("User is not an Election Manager");
        }
        auth.setApproved(true);
        authRepository.save(auth);
    }

    // ===== STATS =====

    public StatsResponse getStats() {
        return StatsResponse.builder()
                .totalUsers(citizenRepository.count())
                .totalVotes(voteRepository.count())
                .activeElections(electionRepository.findByStatus(ElectionStatus.ACTIVE).size())
                .totalElections(electionRepository.count())
                .build();
    }

    // ===== USER MANAGEMENT =====

    public List<UserResponse> getAllUsers() {
        List<Auth> allAuths = authRepository.findAll();
        Map<String, Citizen> citizenMap = citizenRepository.findAll().stream()
                .collect(Collectors.toMap(Citizen::getId, c -> c));

        return allAuths.stream().map(auth -> {
            Citizen c = citizenMap.get(auth.getCitizenId());
            return UserResponse.builder()
                    .id(auth.getId())
                    .name(c != null ? c.getName() : "Unknown")
                    .email(auth.getEmail())
                    .role(auth.getRole().name())
                    .citizenId(auth.getCitizenId())
                    .isVerified(auth.isEmailVerified())
                    .isApproved(auth.isApproved())
                    .voterId(c != null ? c.getVoterId() : null)
                    .phone(c != null ? c.getPhone() : null)
                    .address(c != null ? c.getAddress() : null)
                    .state(c != null ? c.getState() : null)
                    .pincode(c != null ? c.getPincode() : null)
                    .aadhaarId(c != null ? c.getAadhaarId() : null)
                    .build();
        }).collect(Collectors.toList());
    }
}
