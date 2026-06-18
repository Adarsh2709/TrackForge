package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.client.GeminiClient;
import org.example.dto.*;
import org.example.entity.Issue;
import org.example.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final GeminiClient geminiClient;
    private final IssueRepository issueRepository;
    private final ObjectMapper objectMapper;

    public PrioritizationResponseDTO prioritizeIssue(PrioritizationRequestDTO request) {
        String prompt = String.format(
            "You are an expert agile project manager. Analyze the following issue details and output ONLY a valid JSON object matching this schema: " +
            "{\"priority\": \"string (Low, Medium, High, Critical)\", \"riskScore\": \"integer (0-100)\", \"estimatedImpact\": \"string\", \"shortExplanation\": \"string\"}. " +
            "Issue Title: %s. Issue Description: %s. Tags: %s. User Severity: %s.",
            request.getTitle(), request.getDescription(), request.getTags(), request.getSeverity()
        );

        try {
            String jsonResponse = geminiClient.generateContent(prompt);
            return objectMapper.readValue(jsonResponse, PrioritizationResponseDTO.class);
        } catch (Exception e) {
            log.error("Failed to prioritize issue via AI", e);
            return PrioritizationResponseDTO.builder()
                    .priority("Medium")
                    .riskScore(50)
                    .estimatedImpact("Unknown")
                    .shortExplanation("AI analysis failed. Error: " + e.getMessage())
                    .build();
        }
    }

    public DuplicateCheckResponseDTO checkDuplicate(DuplicateCheckRequestDTO request) {
        List<Issue> existingIssues = issueRepository.findAll();
        if(existingIssues.size() > 50) {
            existingIssues = existingIssues.subList(existingIssues.size() - 50, existingIssues.size());
        }

        String existingIssuesContext = existingIssues.stream()
                .map(i -> String.format("ID: %s, Title: %s, Desc: %s", i.getId(), i.getTitle(), i.getDescription()))
                .collect(Collectors.joining(" | "));

        String prompt = String.format(
            "You are an AI issue tracker duplicate detection system. Compare the new issue with the existing issues. " +
            "If any existing issue is very similar (>80%%), mark hasDuplicate as true. Output ONLY valid JSON matching this schema: " +
            "{\"hasDuplicate\": boolean, \"similarIssues\": [{\"existingIssueId\": \"string\", \"existingIssueTitle\": \"string\", \"similarityPercentage\": integer, \"duplicateConfidenceScore\": integer}]}. " +
            "New Issue Title: %s. New Issue Description: %s. " +
            "Existing Issues: %s",
            request.getTitle(), request.getDescription(), existingIssuesContext
        );

        try {
            String jsonResponse = geminiClient.generateContent(prompt);
            return objectMapper.readValue(jsonResponse, DuplicateCheckResponseDTO.class);
        } catch (Exception e) {
            log.error("Failed to check for duplicates via AI", e);
            return DuplicateCheckResponseDTO.builder().hasDuplicate(false).build();
        }
    }

    private SprintHealthResponseDTO cachedSprintHealth;
    private long lastSprintHealthFetchTime = 0;
    private static final long CACHE_DURATION_MS = 60000; // 1 minute

    public SprintHealthResponseDTO getSprintHealth() {
        if (cachedSprintHealth != null && (System.currentTimeMillis() - lastSprintHealthFetchTime) < CACHE_DURATION_MS) {
            return cachedSprintHealth;
        }

        List<Issue> issues = issueRepository.findAll();
        
        long totalOpen = issues.stream().filter(i -> !"DONE".equalsIgnoreCase(i.getStatus())).count();
        long criticalOpen = issues.stream().filter(i -> "Critical".equalsIgnoreCase(i.getPriority()) && !"DONE".equalsIgnoreCase(i.getStatus())).count();
        long completed = issues.stream().filter(i -> "DONE".equalsIgnoreCase(i.getStatus())).count();

        String prompt = String.format(
            "You are an agile coach. Analyze these sprint metrics and provide sprint health insights. Output ONLY valid JSON matching this schema: " +
            "{\"sprintHealthScore\": integer (0-100), \"riskLevel\": \"string (Low, Medium, High)\", \"bottlenecks\": [\"string\"], \"recommendations\": [\"string\"]}. " +
            "Total Open Issues: %d. Critical Open Issues: %d. Completed Issues: %d.",
            totalOpen, criticalOpen, completed
        );

        try {
            String jsonResponse = geminiClient.generateContent(prompt);
            SprintHealthResponseDTO response = objectMapper.readValue(jsonResponse, SprintHealthResponseDTO.class);
            cachedSprintHealth = response;
            lastSprintHealthFetchTime = System.currentTimeMillis();
            return response;
        } catch (Exception e) {
            log.error("Failed to get sprint health via AI", e);
            return SprintHealthResponseDTO.builder()
                    .sprintHealthScore(50)
                    .riskLevel("Medium")
                    .bottlenecks(List.of("Unable to analyze bottlenecks"))
                    .recommendations(List.of("Check AI service connection", "Error: " + e.getMessage()))
                    .build();
        }
    }
}
