package com.votingapp.controller;

import com.votingapp.dto.request.ElectionRequest;
import com.votingapp.dto.request.ElectionUpdateRequest;
import com.votingapp.dto.response.ElectionResponse;
import com.votingapp.security.JwtUtil;
import com.votingapp.service.ElectionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    @Autowired
    private ElectionService electionService;

    @Autowired
    private JwtUtil jwtUtil;

    // ===== CREATE =====

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<ElectionResponse> createElection(
            @Valid @RequestBody ElectionRequest request,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String creatorId = (String) jwtUtil.extractClaim(token, claims -> claims.get("userId"));
        return ResponseEntity.ok(electionService.createElection(request, creatorId));
    }

    // ===== UPDATE =====

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<ElectionResponse> updateElection(
            @PathVariable String id,
            @RequestBody ElectionUpdateRequest request,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String requesterId = (String) jwtUtil.extractClaim(token, claims -> claims.get("userId"));
        String requesterRole = (String) jwtUtil.extractClaim(token, claims -> claims.get("role"));
        return ResponseEntity.ok(electionService.updateElection(id, request, requesterId, requesterRole));
    }

    // ===== READ =====

    @GetMapping
    public ResponseEntity<List<ElectionResponse>> getElections(HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String citizenId = (String) jwtUtil.extractClaim(token, claims -> claims.get("citizenId"));
        String role = (String) jwtUtil.extractClaim(token, claims -> claims.get("role"));
        String userId = (String) jwtUtil.extractClaim(token, claims -> claims.get("userId"));

        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(electionService.getAllElections());
        }
        if ("ELECTION_MANAGER".equals(role)) {
            // Managers see only their own elections
            return ResponseEntity.ok(electionService.getElectionsByCreator(userId));
        }
        return ResponseEntity.ok(electionService.getEligibleElections(citizenId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ElectionResponse>> getAllElections() {
        return ResponseEntity.ok(electionService.getAllElections());
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<ElectionResponse>> getUpcomingElections() {
        // Returns all UPCOMING elections for nomination purposes
        // No eligibility filtering - any citizen can apply
        return ResponseEntity.ok(electionService.getUpcomingElections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectionResponse> getElectionById(
            @PathVariable String id,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String citizenId = (String) jwtUtil.extractClaim(token, claims -> claims.get("citizenId"));
        return ResponseEntity.ok(electionService.getElectionById(id, citizenId));
    }

    /**
     * Shareable invite link endpoint — authenticated citizen opens the link,
     * gets added to eligible list automatically.
     */
    @GetMapping("/invite/{token}")
    public ResponseEntity<ElectionResponse> getElectionByInviteToken(
            @PathVariable String token,
            HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        String citizenId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            citizenId = (String) jwtUtil.extractClaim(jwt, claims -> claims.get("citizenId"));
        }
        return ResponseEntity.ok(electionService.getElectionByInviteToken(token, citizenId));
    }

    // ===== DELETE =====

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<Void> deleteElection(
            @PathVariable String id,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String requesterId = (String) jwtUtil.extractClaim(token, claims -> claims.get("userId"));
        String requesterRole = (String) jwtUtil.extractClaim(token, claims -> claims.get("role"));
        electionService.deleteElection(id, requesterId, requesterRole);
        return ResponseEntity.noContent().build();
    }

    // ===== REGENERATE INVITE TOKEN =====

    @PostMapping("/{id}/regenerate-invite")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_MANAGER')")
    public ResponseEntity<ElectionResponse> regenerateInviteToken(
            @PathVariable String id,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String requesterId = (String) jwtUtil.extractClaim(token, claims -> claims.get("userId"));
        String requesterRole = (String) jwtUtil.extractClaim(token, claims -> claims.get("role"));
        return ResponseEntity.ok(electionService.regenerateInviteToken(id, requesterId, requesterRole));
    }
}
