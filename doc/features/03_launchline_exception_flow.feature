Feature: Launchline exception flow
  The launch manager can make a visible and accountable decision when work slips.

  Scenario: Normal: Resolve a delayed delivery
    Given a location has a delayed equipment delivery
    When the launch manager records a mitigation and assigns an owner
    Then the impact preview lists the affected work
    And resolving the exception updates the readiness state and activity history

  Scenario: Edge: Accept a managed risk
    Given a delayed delivery cannot be moved before the opening date
    When the launch manager records a conditional approval with a decision note
    Then the location is marked as approved with risk
    And the approval record names the approver and condition

  Scenario: Error: Require a complete exception decision
    Given the exception form is open
    When the launch manager attempts to save without an owner or mitigation
    Then the missing fields are identified
    And no portfolio, schedule, or activity state changes
