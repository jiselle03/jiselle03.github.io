Feature: Launchline location workspace
  The launch manager can coordinate the work and approvals for one location.

  Scenario: Normal: Reassign a blocked launch task
    Given a location has a task blocked by a delivery dependency
    When the launch manager assigns the task to an available training lead
    Then the plan shows the new owner and next due date
    And the role inbox and activity history reflect the assignment

  Scenario: Edge: Reveal a schedule conflict
    Given a delivery and a training session overlap for the same location
    When the launch manager opens the schedule
    Then the conflicting events are visually identified
    And the related dependency explains the impact on the opening plan

  Scenario: Error: Prevent an incomplete opening approval
    Given a location has an unresolved blocker
    When the launch manager tries to approve the opening
    Then the approval sheet identifies the blocker
    And approval remains unavailable until the manager accepts risk or resolves the issue
