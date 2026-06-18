package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateCheckResponseDTO {
    private boolean hasDuplicate;
    private List<DuplicateIssue> similarIssues;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DuplicateIssue {
        private String existingIssueId;
        private String existingIssueTitle;
        private int similarityPercentage;
        private int duplicateConfidenceScore;
    }
}
