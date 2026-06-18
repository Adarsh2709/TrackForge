package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrioritizationResponseDTO {
    private String priority;
    private Integer riskScore;
    private String estimatedImpact;
    private String shortExplanation;
}
