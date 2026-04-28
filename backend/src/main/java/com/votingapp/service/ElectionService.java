package com.votingapp.service;

import com.votingapp.dto.request.ElectionRequest;
import com.votingapp.dto.request.ElectionUpdateRequest;
import com.votingapp.dto.response.CandidateResponse;
import com.votingapp.dto.response.ElectionResponse;
import com.votingapp.entity.Election;
import com.votingapp.entity.ElectionStatus;
import com.votingapp.exception.ResourceNotFoundException;
import com.votingapp.repository.CandidateRepository;
import com.votingapp.repository.ElectionRepository;
import com.votingapp.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    // ===== CREATE =====

    public ElectionResponse createElection(ElectionRequest request, String creatorId) {
        boolean allEligible = "ALL".equalsIgnoreCase(request.getEligibilityMode())
                || "INVITE".equalsIgnoreCase(request.getEligibilityMode());

        String inviteToken = null;
        if ("INVITE".equalsIgnoreCase(request.getEligibilityMode())) {
            inviteToken = UUID.randomUUID().toString().replace("-", "");
        }

        // Convert string times to LocalDateTime (treating them as IST)
        LocalDateTime startTime = request.getStartTimeAsLocalDateTime();
        LocalDateTime endTime = request.getEndTimeAsLocalDateTime();

        Election election = Election.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(startTime)
                .endTime(endTime)
                .status(calculateStatus(startTime, endTime))
                .createdBy(creatorId)
                .allEligible(allEligible)
                .eligibleCitizenIds(
                        "SPECIFIC".equalsIgnoreCase(request.getEligibilityMode())
                                ? request.getEligibleCitizenIds()
                                : new ArrayList<>()
                )
                .inviteToken(inviteToken)
                .build();

        return mapToResponse(electionRepository.save(election), null);
    }

    // ===== UPDATE =====

    public ElectionResponse updateElection(String id, ElectionUpdateRequest request, String requesterId, String requesterRole) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        // Only creator or ADMIN can update
        if (!"ADMIN".equals(requesterRole) && !election.getCreatedBy().equals(requesterId)) {
            throw new IllegalArgumentException("You are not authorized to update this election.");
        }

        if (request.getTitle() != null) election.setTitle(request.getTitle());
        if (request.getDescription() != null) election.setDescription(request.getDescription());
        if (request.getStartTime() != null) election.setStartTime(request.getStartTimeAsLocalDateTime());
        if (request.getEndTime() != null) election.setEndTime(request.getEndTimeAsLocalDateTime());

        if (request.getEligibilityMode() != null) {
            String mode = request.getEligibilityMode();
            if ("ALL".equalsIgnoreCase(mode) || "INVITE".equalsIgnoreCase(mode)) {
                election.setAllEligible(true);
                election.setEligibleCitizenIds(new ArrayList<>());
                if ("INVITE".equalsIgnoreCase(mode) && election.getInviteToken() == null) {
                    election.setInviteToken(UUID.randomUUID().toString().replace("-", ""));
                }
            } else {
                election.setAllEligible(false);
                if (request.getEligibleCitizenIds() != null) {
                    election.setEligibleCitizenIds(request.getEligibleCitizenIds());
                }
            }
        }

        // Recalculate status if times changed
        if (request.getStartTime() != null || request.getEndTime() != null) {
            election.setStatus(calculateStatus(election.getStartTime(), election.getEndTime()));
        }

        return mapToResponse(electionRepository.save(election), null);
    }

    // ===== READ =====

    public List<ElectionResponse> getEligibleElections(String citizenId) {
        // Refresh statuses first
        refreshAllStatuses();

        // Elections where citizen is explicitly listed
        List<Election> specific = electionRepository.findByEligibleCitizenIdsContaining(citizenId);
        // Elections open to all
        List<Election> allOpen = electionRepository.findByAllEligibleTrue();

        // Merge, deduplicate
        List<Election> combined = new ArrayList<>(allOpen);
        for (Election e : specific) {
            if (combined.stream().noneMatch(x -> x.getId().equals(e.getId()))) {
                combined.add(e);
            }
        }

        return combined.stream()
                .map(e -> {
                    boolean hasVoted = voteRepository.existsByCitizenIdAndElectionId(citizenId, e.getId());
                    return mapToResponse(e, hasVoted);
                })
                .collect(Collectors.toList());
    }

    public List<ElectionResponse> getAllElections() {
        refreshAllStatuses();
        return electionRepository.findAll().stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }
    
    public List<ElectionResponse> getUpcomingElections() {
        refreshAllStatuses();
        return electionRepository.findByStatus(ElectionStatus.UPCOMING).stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }

    public List<ElectionResponse> getElectionsByCreator(String creatorId) {
        refreshAllStatuses();
        return electionRepository.findByCreatedBy(creatorId).stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }

    public ElectionResponse getElectionById(String id, String citizenId) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        // Refresh status
        ElectionStatus fresh = calculateStatus(election.getStartTime(), election.getEndTime());
        if (fresh != election.getStatus()) {
            election.setStatus(fresh);
            electionRepository.save(election);
        }

        Boolean hasVoted = citizenId != null ? voteRepository.existsByCitizenIdAndElectionId(citizenId, id) : null;
        return mapToResponse(election, hasVoted);
    }

    /**
     * Get election by invite token — used for shareable links.
     * Adds the citizen to eligibleCitizenIds if not already there.
     */
    public ElectionResponse getElectionByInviteToken(String token, String citizenId) {
        Election election = electionRepository.findByInviteToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired invite link."));

        // Auto-add citizen to eligible list if not already there
        if (!election.isAllEligible() && citizenId != null
                && !election.getEligibleCitizenIds().contains(citizenId)) {
            election.getEligibleCitizenIds().add(citizenId);
            electionRepository.save(election);
        }

        Boolean hasVoted = citizenId != null
                ? voteRepository.existsByCitizenIdAndElectionId(citizenId, election.getId())
                : null;
        return mapToResponse(election, hasVoted);
    }

    // ===== DELETE =====

    public void deleteElection(String id, String requesterId, String requesterRole) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        if (!"ADMIN".equals(requesterRole) && !election.getCreatedBy().equals(requesterId)) {
            throw new IllegalArgumentException("You are not authorized to delete this election.");
        }

        electionRepository.deleteById(id);
        candidateRepository.deleteByElectionId(id);
        voteRepository.deleteByElectionId(id);
    }

    // ===== REGENERATE INVITE TOKEN =====

    public ElectionResponse regenerateInviteToken(String id, String requesterId, String requesterRole) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found"));

        if (!"ADMIN".equals(requesterRole) && !election.getCreatedBy().equals(requesterId)) {
            throw new IllegalArgumentException("Not authorized.");
        }

        election.setInviteToken(UUID.randomUUID().toString().replace("-", ""));
        return mapToResponse(electionRepository.save(election), null);
    }

    // ===== HELPERS =====

    private void refreshAllStatuses() {
        List<Election> all = electionRepository.findAll();
        List<Election> toUpdate = new ArrayList<>();
        for (Election e : all) {
            ElectionStatus fresh = calculateStatus(e.getStartTime(), e.getEndTime());
            if (fresh != e.getStatus()) {
                e.setStatus(fresh);
                toUpdate.add(e);
            }
        }
        if (!toUpdate.isEmpty()) {
            electionRepository.saveAll(toUpdate);
        }
    }

    private ElectionStatus calculateStatus(LocalDateTime start, LocalDateTime end) {
        // Use IST timezone for accurate status calculation
        ZoneId istZone = ZoneId.of("Asia/Kolkata");
        LocalDateTime nowIST = LocalDateTime.now(istZone);
        
        if (nowIST.isBefore(start)) return ElectionStatus.UPCOMING;
        if (nowIST.isAfter(end)) return ElectionStatus.CLOSED;
        return ElectionStatus.ACTIVE;
    }

    private String resolveEligibilityMode(Election e) {
        if (e.getInviteToken() != null) return "INVITE";
        if (e.isAllEligible()) return "ALL";
        return "SPECIFIC";
    }

    ElectionResponse mapToResponse(Election e, Boolean hasVoted) {
        List<CandidateResponse> candidates = candidateRepository.findByElectionId(e.getId())
                .stream()
                .map(c -> CandidateResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .party(c.getParty())
                        .description(c.getDescription())
                        .electionId(c.getElectionId())
                        .build())
                .collect(Collectors.toList());

        long totalVotes = voteRepository.countByElectionId(e.getId());

        return ElectionResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .startTime(e.getStartTime())
                .endTime(e.getEndTime())
                .status(e.getStatus())
                .createdBy(e.getCreatedBy())
                .allEligible(e.isAllEligible())
                .eligibilityMode(resolveEligibilityMode(e))
                .eligibleCitizenIds(e.getEligibleCitizenIds())
                .inviteToken(e.getInviteToken())
                .hasVoted(hasVoted != null ? hasVoted : false)
                .candidateCount(candidates.size())
                .totalVotes((int) totalVotes)
                .candidates(candidates)
                .build();
    }
}
