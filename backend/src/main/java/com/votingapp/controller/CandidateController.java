package com.votingapp.controller;

import com.votingapp.dto.request.CandidateRequest;
import com.votingapp.dto.response.CandidateResponse;
import com.votingapp.entity.Candidate;
import com.votingapp.entity.CandidateStatus;
import com.votingapp.repository.CandidateRepository;
import com.votingapp.repository.AuthRepository;
import com.votingapp.repository.CitizenRepository;
import com.votingapp.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthRepository authRepository;
    
    @Autowired
    private CitizenRepository citizenRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER', 'CITIZEN')")
    public ResponseEntity<CandidateResponse> submitCandidateApplication(
            @Valid @RequestBody CandidateRequest request,
            @RequestHeader("Authorization") String token) {
        
        String email = jwtUtil.extractUsername(token.substring(7));
        
        Candidate candidate = Candidate.builder()
                .name(request.getName())
                .party(request.getParty())
                .description(request.getDescription())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .age(request.getAge())
                .education(request.getEducation())
                .occupation(request.getOccupation())
                .previousPositions(request.getPreviousPositions())
                .criminalRecord(request.getCriminalRecord())
                .assetsValue(request.getAssetsValue())
                .photoUrl(request.getPhotoUrl())
                .affidavitUrl(request.getAffidavitUrl())
                .nominationFormUrl(request.getNominationFormUrl())
                .nominationFeePaid(request.getNominationFeePaid() != null ? request.getNominationFeePaid() : false)
                .nominationFeeReceiptNo(request.getNominationFeeReceiptNo())
                .nominationFeeDate(request.getNominationFeePaid() != null && request.getNominationFeePaid() 
                    ? LocalDateTime.now() : null)
                .status(CandidateStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .electionId(request.getElectionId())
                .citizenId(request.getCitizenId())
                .build();
        
        candidate = candidateRepository.save(candidate);
        
        return ResponseEntity.ok(mapToResponse(candidate));
    }
    
    @PostMapping("/nominate")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<CandidateResponse> citizenSelfNomination(
            @Valid @RequestBody com.votingapp.dto.request.CitizenNominationRequest request,
            @RequestHeader("Authorization") String token) {
        
        String email = jwtUtil.extractUsername(token.substring(7));
        
        // Get citizen details from auth
        com.votingapp.entity.Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new com.votingapp.exception.ResourceNotFoundException("User not found"));
        
        com.votingapp.entity.Citizen citizen = citizenRepository.findById(auth.getCitizenId())
                .orElseThrow(() -> new com.votingapp.exception.ResourceNotFoundException("Citizen profile not found"));
        
        // CHECK: Prevent duplicate applications for the same election
        java.util.Optional<Candidate> existingApplication = candidateRepository.findByElectionIdAndCitizenId(
                request.getElectionId(), 
                citizen.getId()
        );
        
        if (existingApplication.isPresent()) {
            Candidate existing = existingApplication.get();
            if (existing.getStatus() == CandidateStatus.PENDING) {
                throw new IllegalArgumentException("You have already applied for this election. Your application is pending review.");
            } else if (existing.getStatus() == CandidateStatus.APPROVED) {
                throw new IllegalArgumentException("You have already been approved as a candidate for this election.");
            } else if (existing.getStatus() == CandidateStatus.REJECTED) {
                throw new IllegalArgumentException("Your previous application for this election was rejected. You cannot apply again.");
            }
        }
        
        // Auto-fill from citizen profile
        Candidate candidate = Candidate.builder()
                .name(citizen.getName())
                .email(citizen.getEmail())
                .phone(citizen.getPhone())
                .address(citizen.getAddress())
                .age(citizen.getAge())
                .party(request.getParty())
                .description(request.getManifesto())
                .education(request.getEducation())
                .occupation(request.getOccupation())
                .previousPositions(request.getPreviousPositions())
                .criminalRecord(request.getCriminalRecord())
                .assetsValue(request.getAssetsValue())
                .photoUrl(request.getPhotoUrl())
                .affidavitUrl(request.getAffidavitUrl())
                .nominationFormUrl(request.getNominationFormUrl())
                .nominationFeePaid(request.getNominationFeePaid() != null ? request.getNominationFeePaid() : false)
                .nominationFeeReceiptNo(request.getNominationFeeReceiptNo())
                .nominationFeeDate(request.getNominationFeePaid() != null && request.getNominationFeePaid() 
                    ? LocalDateTime.now() : null)
                .status(CandidateStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .electionId(request.getElectionId())
                .citizenId(citizen.getId())
                .build();
        
        candidate = candidateRepository.save(candidate);
        
        return ResponseEntity.ok(mapToResponse(candidate));
    }

    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<CandidateResponse>> getCandidatesForElection(
            @PathVariable String electionId,
            @RequestParam(required = false, defaultValue = "false") boolean includeAll) {
        
        List<Candidate> candidates = candidateRepository.findByElectionId(electionId);
        
        // By default, only return APPROVED candidates for public view
        // If includeAll=true (for admins), return all statuses
        if (!includeAll) {
            candidates = candidates.stream()
                    .filter(c -> c.getStatus() == CandidateStatus.APPROVED)
                    .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(candidates.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<List<CandidateResponse>> getPendingCandidates() {
        List<Candidate> pending = candidateRepository.findByStatus(CandidateStatus.PENDING);
        return ResponseEntity.ok(pending.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }
    
    @GetMapping("/pending/election/{electionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<List<CandidateResponse>> getPendingCandidatesForElection(@PathVariable String electionId) {
        List<Candidate> pending = candidateRepository.findByElectionIdAndStatus(electionId, CandidateStatus.PENDING);
        return ResponseEntity.ok(pending.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }
    
    @PostMapping("/{candidateId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<CandidateResponse> approveCandidate(
            @PathVariable String candidateId,
            @RequestHeader("Authorization") String token) {
        
        String email = jwtUtil.extractUsername(token.substring(7));
        
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new com.votingapp.exception.ResourceNotFoundException("Candidate not found"));
        
        candidate.setStatus(CandidateStatus.APPROVED);
        candidate.setApprovedAt(LocalDateTime.now());
        candidate.setApprovedBy(email);
        candidate.setRejectionReason(null);
        
        candidate = candidateRepository.save(candidate);
        
        return ResponseEntity.ok(mapToResponse(candidate));
    }
    
    @PostMapping("/{candidateId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<CandidateResponse> rejectCandidate(
            @PathVariable String candidateId,
            @RequestBody(required = false) String reason) {
        
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new com.votingapp.exception.ResourceNotFoundException("Candidate not found"));
        
        candidate.setStatus(CandidateStatus.REJECTED);
        candidate.setRejectionReason(reason != null ? reason : "Application does not meet requirements");
        
        candidate = candidateRepository.save(candidate);
        
        return ResponseEntity.ok(mapToResponse(candidate));
    }

    @DeleteMapping("/{candidateId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<Void> deleteCandidate(@PathVariable String candidateId) {
        if (!candidateRepository.existsById(candidateId)) {
            throw new com.votingapp.exception.ResourceNotFoundException("Candidate not found");
        }
        candidateRepository.deleteById(candidateId);
        return ResponseEntity.noContent().build();
    }
    
    private CandidateResponse mapToResponse(Candidate c) {
        return CandidateResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .party(c.getParty())
                .description(c.getDescription())
                .email(c.getEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .age(c.getAge())
                .education(c.getEducation())
                .occupation(c.getOccupation())
                .previousPositions(c.getPreviousPositions())
                .criminalRecord(c.getCriminalRecord())
                .assetsValue(c.getAssetsValue())
                .photoUrl(c.getPhotoUrl())
                .affidavitUrl(c.getAffidavitUrl())
                .nominationFormUrl(c.getNominationFormUrl())
                .status(c.getStatus())
                .rejectionReason(c.getRejectionReason())
                .submittedAt(c.getSubmittedAt())
                .approvedAt(c.getApprovedAt())
                .approvedBy(c.getApprovedBy())
                .nominationFeePaid(c.getNominationFeePaid())
                .nominationFeeReceiptNo(c.getNominationFeeReceiptNo())
                .nominationFeeDate(c.getNominationFeeDate())
                .electionId(c.getElectionId())
                .citizenId(c.getCitizenId())
                .build();
    }
}

