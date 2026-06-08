package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.IssueRequest;
import org.example.entity.Issue;
import org.example.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    public ResponseEntity<Issue> createIssue(@RequestBody IssueRequest request) {
        return ResponseEntity.ok(issueService.createIssue(request));
    }

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable String id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable String id, @RequestBody IssueRequest request) {
        return ResponseEntity.ok(issueService.updateIssue(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable String id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }
}
