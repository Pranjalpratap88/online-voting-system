package com.votingapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Online Voting Portal - Your Verification Code");
        message.setText(
            "Hello,\n\n" +
            "Your one-time verification code is:\n\n" +
            "  " + otp + "\n\n" +
            "This code is valid for 10 minutes. Do not share it with anyone.\n\n" +
            "If you did not request this code, please ignore this email.\n\n" +
            "— Online Voting Portal Security Team"
        );
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken, String frontendBaseUrl) {
        String resetLink = frontendBaseUrl + "/reset-password?token=" + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Online Voting Portal - Password Reset Request");
        message.setText(
            "Hello,\n\n" +
            "We received a request to reset the password for your Online Voting Portal account.\n\n" +
            "Click the link below to reset your password:\n\n" +
            "  " + resetLink + "\n\n" +
            "This link is valid for 30 minutes. If you did not request a password reset, " +
            "you can safely ignore this email — your password will not be changed.\n\n" +
            "For security, never share this link with anyone.\n\n" +
            "— Online Voting Portal Security Team"
        );
        mailSender.send(message);
    }
}
