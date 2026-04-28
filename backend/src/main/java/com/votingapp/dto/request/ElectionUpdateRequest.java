package com.votingapp.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
public class ElectionUpdateRequest {
    private String title;
    private String description;
    private String startTime;  // Changed to String for IST handling
    private String endTime;    // Changed to String for IST handling
    private String eligibilityMode;
    private List<String> eligibleCitizenIds;

    /**
     * Convert string datetime to LocalDateTime (treating as IST)
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
