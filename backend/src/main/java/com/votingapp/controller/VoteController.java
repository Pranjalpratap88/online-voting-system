package com.votingapp.controller;

import com.votingapp.dto.request.VoteRequest;
import com.votingapp.security.JwtUtil;
import com.votingapp.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vote")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<String> castVote(@Valid @RequestBody VoteRequest request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String citizenId = (String) jwtUtil.extractClaim(token, claims -> claims.get("citizenId"));
        
        if (citizenId == null) {
            return ResponseEntity.status(403).body("Citizen ID missing in token");
        }

        voteService.castVote(request, citizenId);
        return ResponseEntity.ok("Vote cast successfully!");
    }
}
