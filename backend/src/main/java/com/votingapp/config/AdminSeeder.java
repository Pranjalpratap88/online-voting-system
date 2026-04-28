package com.votingapp.config;

import com.votingapp.entity.Auth;
import com.votingapp.entity.Citizen;
import com.votingapp.entity.Role;
import com.votingapp.repository.AuthRepository;
import com.votingapp.repository.CitizenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdminUser(AuthRepository authRepository, CitizenRepository citizenRepository) {
        return args -> {
            String adminEmail = "admin@onlinevoting.portal";
            if (!authRepository.existsByEmail(adminEmail)) {
                
                Citizen adminCitizen = Citizen.builder()
                        .voterId("ADMIN001")
                        .name("System Administrator")
                        .email(adminEmail)
                        .isVerified(true)
                        .createdSource(Citizen.CreatedSource.SELF_REGISTERED)
                        .build();
                adminCitizen = citizenRepository.save(adminCitizen);

                Auth adminAuth = Auth.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .citizenId(adminCitizen.getId())
                        .isEmailVerified(true)
                        .isApproved(true)
                        .build();
                authRepository.save(adminAuth);

                System.out.println("Default Admin User Created:");
                System.out.println("Email: " + adminEmail);
                System.out.println("Password: admin123");
            }
        };
    }
}
