package org.example.client;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private final WebClient webClient;
    
    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public GeminiClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateContent(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", prompt)
                    )
                )
            ),
            "generationConfig", Map.of(
                "response_mime_type", "application/json"
            )
        );

        String cleanKey = apiKey != null ? apiKey.trim() : "";
        GeminiResponse response = webClient.post()
                .uri(GEMINI_API_URL + "?key=" + cleanKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();

        if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
            String text = response.getCandidates().get(0).getContent().getParts().get(0).getText();
            if (text != null) {
                text = text.trim();
                if (text.startsWith("```json")) {
                    text = text.substring(7).trim();
                } else if (text.startsWith("```")) {
                    text = text.substring(3).trim();
                }
                if (text.endsWith("```")) {
                    text = text.substring(0, text.length() - 3).trim();
                }
            }
            return text;
        }
        return "{}";
    }

    @Data
    @NoArgsConstructor
    public static class GeminiResponse {
        private List<Candidate> candidates;
        
        @Data
        @NoArgsConstructor
        public static class Candidate {
            private Content content;
        }
        
        @Data
        @NoArgsConstructor
        public static class Content {
            private List<Part> parts;
        }
        
        @Data
        @NoArgsConstructor
        public static class Part {
            private String text;
        }
    }
}
