package com.votingapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
public class ElectionRequest {

    @NotBlank
    private String title;

    private String description;

    private String startTime;  // Changed to String to handle IST conversion
    private String endTime;    // Changed to String to handle IST conversion

    /**
     * Eligibility mode:
     *   "ALL"    — all registered citizens can vote
     *   "INVITE" — anyone with the invite link can vote (generates a token)
     *   "SPECIFIC" — only the listed citizenIds can vote
     */
    private String eligibilityMode = "SPECIFIC";

    /** Used when eligibilityMode = "SPECIFIC" */
    private List<String> eligibleCitizenIds = new ArrayList<>();

    /**
     * Convert string datetime (from frontend) to LocalDateTime in IST
     * Frontend sends: "2026-05-15T10:00:00" (as user sees it in calendar)
     * We treat this as IST time
     */
    public LocalDateTime getStartTimeAsLocalDateTime() {
        if (startTime == null) return null;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            return LocalDateTime.parse(startTime, formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid start time format: " + startTime);
        }
    }

    public LocalDateTime getEndTimeAsLocalDateTime() {
        if (endTime == null) return null;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            return LocalDateTime.parse(endTime, formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid end time format: " + endTime);
        }
    }
}
