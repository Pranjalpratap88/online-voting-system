package com.votingapp.repository;

import com.votingapp.entity.Auth;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AuthRepository extends MongoRepository<Auth, String> {
    Optional<Auth> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Auth> findByPasswordResetToken(String passwordResetToken);
}
