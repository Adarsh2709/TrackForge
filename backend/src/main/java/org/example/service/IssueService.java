package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.IssueRequest;
import org.example.entity.Issue;
import org.example.repository.IssueRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public Issue createIssue(IssueRequest request) {
        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : "Open")
                .createdBy(getCurrentUserEmail())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return issueRepository.save(issue);
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Issue getIssueById(String id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Issue not found with id: " + id));
    }

    public Issue updateIssue(String id, IssueRequest request) {
        Issue issue = getIssueById(id);
        
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setType(request.getType());
        issue.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            issue.setStatus(request.getStatus());
        }
        issue.setUpdatedAt(LocalDateTime.now());
        
        return issueRepository.save(issue);
    }

    public void deleteIssue(String id) {
        if (!issueRepository.existsById(id)) {
            throw new NoSuchElementException("Issue not found with id: " + id);
        }
        issueRepository.deleteById(id);
    }
}
