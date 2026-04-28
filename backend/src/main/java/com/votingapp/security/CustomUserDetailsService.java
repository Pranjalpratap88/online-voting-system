package com.votingapp.security;

import com.votingapp.entity.Auth;
import com.votingapp.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AuthRepository authRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new User(
                auth.getEmail(),
                auth.getPassword() != null ? auth.getPassword() : "", // Empty password for OTP users if needed, but DaoAuthenticationProvider will fail if password is required.
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + auth.getRole().name()))
        );
    }
}
