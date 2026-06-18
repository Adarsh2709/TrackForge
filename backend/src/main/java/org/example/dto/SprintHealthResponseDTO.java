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
public class SprintHealthResponseDTO {
    private int sprintHealthScore;
    private String riskLevel;
    private List<String> bottlenecks;
    private List<String> recommendations;
}
