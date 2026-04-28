package com.votingapp.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "citizens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Citizen {

    @Id
    private String id;

    @Indexed(unique = true)
    private String voterId;

    private String name;
    private int age;
    private String gender;
    private String phone;

    @Indexed(unique = true)
    private String email;

    private String address;
    private String state;
    private String pincode;
    private String aadhaarId;

    private String bio;

    @Builder.Default
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Builder.Default
    private boolean isVerified = false;

    private CreatedSource createdSource;

    public enum CreatedSource {
        CSV, SELF_REGISTERED
    }
}
