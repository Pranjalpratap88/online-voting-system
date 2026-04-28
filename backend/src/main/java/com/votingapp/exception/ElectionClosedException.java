package com.votingapp.exception;

public class ElectionClosedException extends RuntimeException {
    public ElectionClosedException(String message) {
        super(message);
    }
}
