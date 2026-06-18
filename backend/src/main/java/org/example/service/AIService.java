package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.client.GeminiClient;
import org.example.client.GeminiClient.RateLimitException;
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
            "{\"priority\": \"string (Low, Medium, High, Critical)\", \"riskScore\": integer (0-100), \"estimatedImpact\": \"string\", \"shortExplanation\": \"string\"}. " +
            "Issue Title: %s. Issue Description: %s. Tags: %s. User Severity: %s.",
            request.getTitle(), request.getDescription(), request.getTags(), request.getSeverity()
        );

        try {
            String jsonResponse = geminiClient.generateContent(prompt);
            return objectMapper.readValue(jsonResponse, PrioritizationResponseDTO.class);
        } catch (RateLimitException e) {
            log.warn("Rate limited on prioritize issue: {}", e.getMessage());
            return PrioritizationResponseDTO.builder()
                    .priority("Medium")
                    .riskScore(50)
                    .estimatedImpact("Rate limit reached")
                    .shortExplanation("AI is temporarily rate-limited. Please wait 1 minute and try again.")
                    .build();
        } catch (Exception e) {
            log.error("Failed to prioritize issue via AI", e);
            return PrioritizationResponseDTO.builder()
                    .priority("Medium")
                    .riskScore(50)
                    .estimatedImpact("Unknown")
                    .shortExplanation("AI analysis unavailable: " + e.getMessage())
                    .build();
        }
    }

    public DuplicateCheckResponseDTO checkDuplicate(DuplicateCheckRequestDTO request) {
        List<Issue> existingIssues = issueRepository.findAll();
        if (existingIssues.size() > 50) {
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

    // Cache: only successful responses for 10 minutes
    // Rate-limit errors are NOT cached — the frontend 65s countdown handles retry timing
    private SprintHealthResponseDTO cachedSprintHealth;
    private long lastSprintHealthFetchTime = 0;
    private static final long CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

    public SprintHealthResponseDTO getSprintHealth() {
        // Return cached result only if it was a successful response
        if (cachedSprintHealth != null && (System.currentTimeMillis() - lastSprintHealthFetchTime) < CACHE_DURATION_MS) {
            log.info("Returning cached sprint health (age: {}s)", (System.currentTimeMillis() - lastSprintHealthFetchTime) / 1000);
            return cachedSprintHealth;
        }

        List<Issue> issues = issueRepository.findAll();
        long totalOpen = issues.stream().filter(i -> !"DONE".equalsIgnoreCase(i.getStatus())).count();
        long criticalOpen = issues.stream().filter(i -> "Critical".equalsIgnoreCase(i.getPriority()) && !"DONE".equalsIgnoreCase(i.getStatus())).count();
        long completed = issues.stream().filter(i -> "DONE".equalsIgnoreCase(i.getStatus())).count();
        long total = issues.size();

        String prompt = String.format(
            "You are an agile coach AI. Analyze these sprint metrics and provide actionable sprint health insights. " +
            "Output ONLY a valid JSON object with this exact schema: " +
            "{\"sprintHealthScore\": integer, \"riskLevel\": \"Low|Medium|High\", \"bottlenecks\": [\"string\"], \"recommendations\": [\"string\"]}. " +
            "Metrics — Total Issues: %d, Open: %d, Critical & Open: %d, Completed: %d. " +
            "Give 2-3 specific bottlenecks and 2-3 actionable recommendations.",
            total, totalOpen, criticalOpen, completed
        );

        try {
            String jsonResponse = geminiClient.generateContent(prompt);
            SprintHealthResponseDTO response = objectMapper.readValue(jsonResponse, SprintHealthResponseDTO.class);
            // Only cache successful responses
            cachedSprintHealth = response;
            lastSprintHealthFetchTime = System.currentTimeMillis();
            log.info("Sprint health analysis successful, cached for 10 minutes.");
            return response;
        } catch (RateLimitException e) {
            log.warn("Rate limited on sprint health: {}", e.getMessage());
            // Do NOT cache — let the frontend 65s countdown handle retry timing
            return SprintHealthResponseDTO.builder()
                    .sprintHealthScore(0)
                    .riskLevel("Medium")
                    .bottlenecks(List.of("AI rate limit reached"))
                    .recommendations(List.of(
                        "You've hit Gemini's free tier limit (10 requests/min).",
                        "Please wait 1 minute, then click 'Re-Analyze'."
                    ))
                    .build();
        } catch (Exception e) {
            log.error("Failed to get sprint health via AI: {}", e.getMessage());
            return SprintHealthResponseDTO.builder()
                    .sprintHealthScore(0)
                    .riskLevel("Medium")
                    .bottlenecks(List.of("AI analysis unavailable"))
                    .recommendations(List.of("Error: " + e.getMessage()))
                    .build();
        }
    }
}
