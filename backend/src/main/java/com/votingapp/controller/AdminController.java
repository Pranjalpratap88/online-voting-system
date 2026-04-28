package com.votingapp.controller;

import com.votingapp.dto.response.StatsResponse;
import com.votingapp.dto.response.UserResponse;
import com.votingapp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/import-citizens")
    public ResponseEntity<Map<String, Object>> importCitizens(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(adminService.importCitizens(file));
    }

    @PostMapping("/approve-manager/{authId}")
    public ResponseEntity<String> approveManager(@PathVariable String authId) {
        adminService.approveManager(authId);
        return ResponseEntity.ok("Election Manager approved successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}
