Feature: Small Walks local photo journal
  A person can turn a short walk into a small visual record without creating an account.

  Scenario: Normal: Save a found detail from a walk
    Given the person has selected a walk length and a prompt
    When they add a photo, caption, and prompt match
    Then the walk appears in their local walkbook with a date and visual stamp

  Scenario: Edge: Save a text-only walk
    Given the person does not want to add a photo
    When they save a caption and prompt match
    Then the walkbook shows a graphic placeholder instead of a missing image

  Scenario: Error: Explain an incomplete entry
    Given the person has not entered a caption or selected a prompt match
    When they try to save the walk
    Then the form identifies what is missing
    And the walkbook does not change
