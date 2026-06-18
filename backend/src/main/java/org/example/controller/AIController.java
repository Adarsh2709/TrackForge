package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.DuplicateCheckRequestDTO;
import org.example.dto.DuplicateCheckResponseDTO;
import org.example.dto.PrioritizationRequestDTO;
import org.example.dto.PrioritizationResponseDTO;
import org.example.dto.SprintHealthResponseDTO;
import org.example.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin("*") 
public class AIController {

    private final AIService aiService;

    @PostMapping("/prioritize")
    public ResponseEntity<PrioritizationResponseDTO> prioritizeIssue(@RequestBody PrioritizationRequestDTO request) {
        return ResponseEntity.ok(aiService.prioritizeIssue(request));
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<DuplicateCheckResponseDTO> checkDuplicate(@RequestBody DuplicateCheckRequestDTO request) {
        return ResponseEntity.ok(aiService.checkDuplicate(request));
    }

    @GetMapping("/sprint-health")
    public ResponseEntity<SprintHealthResponseDTO> getSprintHealth() {
        return ResponseEntity.ok(aiService.getSprintHealth());
    }
}
