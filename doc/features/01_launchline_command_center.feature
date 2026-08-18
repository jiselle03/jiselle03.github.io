Feature: Launchline command center
  The launch manager can identify the location that needs the next decision.

  Scenario: Normal: Find a launch that needs attention
    Given the launch portfolio contains locations with different readiness states
    When the launch manager selects the "Needs attention" view
    Then only at-risk locations are shown with their blocker, owner, and opening date
    And the first location is opened in the workspace

  Scenario: Edge: Handle a view with no matching launches
    Given no locations match the selected region and opening month
    When the launch manager applies both filters
    Then the portfolio shows an empty state with a way to clear filters

  Scenario: Error: Preserve the current location when a filter changes
    Given the launch manager has a location open in the workspace
    When a saved view would hide that location
    Then the workspace explains that the location is outside the current view
    And the manager can keep the location open or return to the portfolio
