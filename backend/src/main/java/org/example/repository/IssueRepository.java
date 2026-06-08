package org.example.repository;

import org.example.entity.Issue;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface IssueRepository extends MongoRepository<Issue, String> {
    List<Issue> findByCreatedBy(String createdBy);
    List<Issue> findByStatus(String status);
    List<Issue> findByPriority(String priority);
    List<Issue> findByType(String type);
}