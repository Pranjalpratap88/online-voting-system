package com.votingapp.exception;

public class CitizenNotEligibleException extends RuntimeException {
    public CitizenNotEligibleException(String message) {
        super(message);
    }
}
