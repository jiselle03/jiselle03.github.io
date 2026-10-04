# Set Booking Rules

These scenarios capture the highest-risk product behavior for a production version of the fictional Studio demo. They are intentionally concise, but make the operational rules testable before implementation.

## Booking and credits

```gherkin
Feature: Booking a class

  Scenario: A member books an available group class
    Given a member has an active membership with 6 spendable credits
    And an upcoming group occurrence has 1 open seat and costs 2 credits
    When the member confirms the booking with a new idempotency key
    Then one confirmed enrollment exists for that member and occurrence
    And one 2-credit debit exists in the ledger
    And the occurrence has no open seats
    And the member schedule and studio roster show the same booking

  Scenario: Retrying a booking does not charge twice
    Given the member's previous booking request committed successfully
    When the client retries the same request with the same idempotency key
    Then the service returns the existing enrollment
    And no additional ledger debit is created

  Scenario: Only one of two simultaneous final-seat requests succeeds
    Given an occurrence has one open seat
    When two eligible members attempt to book it at the same time
    Then exactly one enrollment is confirmed
    And the other member receives a capacity result they can act on
```

## Cancellation and waitlist

```gherkin
Feature: Changing a booking

  Scenario: An eligible cancellation returns credits
    Given a confirmed enrollment has a cancellation policy that still permits a refund
    When the member cancels the enrollment
    Then the enrollment is marked cancelled
    And a compensating credit ledger entry is created once
    And the cancellation reason and policy outcome are auditable

  Scenario: A late cancellation follows the captured policy
    Given a member booked under a policy that does not refund inside the cutoff
    When the member cancels after the cutoff
    Then the enrollment is marked cancelled
    And no refund ledger entry is created
    And the member sees the applicable outcome before confirming

  Scenario: A waitlisted member is promoted after a seat opens
    Given an occurrence is full and two members are on its active waitlist in rank order
    When a confirmed enrollment is cancelled
    Then the first still-eligible waitlist entry is promoted once
    And its member receives one confirmed enrollment and one ledger debit
    And the next entry remains active
```

## Scheduling and operations

```gherkin
Feature: Partner scheduling

  Scenario: A manager adds a recurring class without a conflict
    Given a manager is authorized for a studio
    And the selected room and instructor are available for the requested local time
    When the manager publishes a weekly class series
    Then a class template and recurrence rule are stored
    And dated occurrences are generated in the studio timezone
    And the new occurrences appear in member availability and the partner roster

  Scenario: A manager cannot silently overlap an instructor
    Given an instructor has an active occurrence during the requested time range
    When a manager attempts to add another occurrence for that instructor
    Then the system rejects the change with the conflicting occurrence details
    And no occurrence is created

  Scenario: An occurrence is cancelled without destroying its series
    Given an occurrence belongs to a weekly class series
    When a manager cancels that date only
    Then the occurrence becomes cancelled with an exception record
    And future occurrences from the series remain unchanged
```

## Mobile and access rules

```gherkin
Feature: Calendar access

  Scenario: A member uses the calendar on a phone
    Given the member opens the schedule on a narrow viewport
    When they change the selected day
    Then the same occurrence data is shown in a single-day list
    And no schedule text is truncated or hidden behind horizontal scrolling

  Scenario: A studio manager opens a roster
    Given a manager belongs to one studio only
    When they request an occurrence roster
    Then the service returns members for that studio only
    And the response does not include payment credentials or unrelated member data

  Scenario: A platform administrator manages a member account
    Given a platform administrator is authorized to support all studios
    When the administrator opens a fictional member record and adjusts a member-facing status, credit balance, or booking
    Then the affected member schedule, credit balance, and applicable studio roster reflect the change
    And an auditable activity entry records the actor, timestamp, reason, and before-and-after values

  Scenario: A studio manager cannot access the platform member directory
    Given a manager is authorized for one studio only
    When the manager attempts to open the platform member directory
    Then access is denied
    And no cross-studio member records are returned

  Scenario: A partner admin defines and assigns a staff role
    Given a partner admin is authorized for Form House
    And Form House has a Trainer role with roster-view and attendance-record permissions
    When the partner admin grants the Trainer role to a Form House staff user
    Then that user can perform only the granted actions for Form House
    And the role definition and assignment are not visible or editable by another partner organization
    And an audit event records the permission and assignment change

  Scenario: A Set platform admin manages platform roles separately
    Given an operations admin is authorized for the Set platform organization
    When the operations admin changes a platform support role
    Then the change affects only Set platform staff assignments
    And no partner-owned role definition or staff assignment is changed
```
