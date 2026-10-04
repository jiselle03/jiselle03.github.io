# Set Production Architecture

## Purpose and boundary

Set is a fictional fitness-studio membership product. The public demo is deliberately frontend-only; this document describes how I would turn the same workflows into a production system.

This is a new, generic architecture. It is informed by experience building multi-role scheduling and booking products, but does not reproduce a client schema, business rules, data, or source code.

## What makes the product more than a calendar

The main problem is keeping several views of the same booking consistent:

- A member needs accurate availability, credits, cancellation terms, and a personal schedule.
- A studio needs its own roster, instructor coverage, capacity, and an audit trail of changes.
- Platform operations needs policy overrides, support tools, and reliable records when a member disputes a charge or a seat.

The design therefore treats a catalog class, a dated session, a member enrollment, and a credit movement as separate things.

## Roles and boundaries

| Role | Can do | Cannot do |
| --- | --- | --- |
| Member | Browse, book, waitlist, cancel eligible bookings, manage account | See another member's record or modify a studio schedule |
| Studio manager | Publish sessions for assigned studios, manage rosters and instructor assignments, review changes | Change platform-wide membership rules or other studios |
| Instructor | View assigned roster and mark attendance | Change capacity, credits, or studio settings |
| Platform operator | Resolve exceptions, manage memberships, audit changes, support bookings | Silently change financial history |

Authorization is checked in the service layer, not only hidden in the UI. A person can have more than one platform role only through explicit role assignments, scoped to an organization or studio.

## Core design decisions

### 1. Separate templates from occurrences

A `class_template` describes a reusable offering: format, duration, base credit cost, default capacity, instructor requirements, and cancellation policy. A recurrence rule turns that template into dated `class_occurrences`.

This prevents recurring schedules from being represented as a mutable blob on one record. It also allows a single occurrence to be cancelled, moved, re-staffed, or given a different capacity without rewriting the series.

### 2. Use actual dated records for bookable seats

Members book an occurrence, not a template. An occurrence stores its final start/end time in UTC, the display timezone, room or virtual location, assigned instructor, capacity, and status. Calendar queries read occurrences, which makes past schedules and one-off changes stable.

### 3. Keep credits in an append-only ledger

Membership credits are never represented only by a mutable balance. The balance is a projection of `credit_ledger_entries` for a member membership. Each booking, refund, expiry, adjustment, or waitlist promotion records its own idempotent ledger entry linked to the business event that caused it.

This makes disputes, retries, and support work traceable. A cancelled booking creates a compensating credit entry; it does not overwrite the original debit.

### 4. Make booking and waitlist promotion transactional

The booking command locks the occurrence, checks the current seat count and member eligibility, creates an enrollment, writes the ledger debit, and records an audit event in one database transaction. A unique constraint prevents a member from holding duplicate active enrollments for the same occurrence.

When a seat opens, a worker considers the waitlist in rank order. It rechecks credit eligibility and policy before promoting exactly one person. Notifications are emitted after the transaction commits so a failed email cannot create a duplicate enrollment.

### 5. Model rules explicitly

Formats can differ. A 1:1 session may have capacity one, a group class can accept many people, and an intro class may require a waiver or a first-time-only rule. The policy evaluated at booking time is stored as a snapshot on the enrollment so future policy edits do not rewrite a member's agreement.

### 6. Treat timezones and exceptions as first-class concerns

Recurring rules are evaluated in the studio timezone. Persisted timestamps are UTC. The system supports blackout windows, instructor leave, holidays, capacity overrides, and moved or cancelled individual occurrences. A recurring class must never be assumed to exist solely because its weekly template exists.

## Service boundaries

```text
Member app / Partner console
            |
            v
API and authorization layer
   |            |             |
Catalog       Booking       Operations
   |            |             |
Templates   Enrollment    Schedule management
Occurrences Ledger        Audit and support tools
   \            |            /
           PostgreSQL
                |
      jobs / notifications / projections
```

| Module | Responsibilities |
| --- | --- |
| Catalog | Studios, instructors, class templates, search filters, public availability read model |
| Scheduling | Recurrence generation, exceptions, rooms, instructor conflicts, occurrence lifecycle |
| Booking | Eligibility, seat locking, enrollment state, waitlists, cancellation and refund policy |
| Memberships | Plans, credit grants, ledger, expiration, pauses, payment-provider references |
| Operations | Partner permissions, rosters, attendance, policy overrides, audit logs |
| Notifications | Booking confirmations, reminders, waitlist promotion, cancellation updates, delivery history |

## Read models

The member schedule and partner roster should not each assemble a full calendar from raw joins on every request. Background jobs or transactional outbox consumers maintain focused projections:

- `member_schedule_items`: upcoming, cancelled, completed, and waitlisted items for a member.
- `studio_roster_items`: an occurrence with live counts, instructor, room, and member-visible status.
- `availability_search`: filterable catalog data with a current open-seat count.

The source-of-truth tables remain authoritative. Projections are rebuildable, and their freshness is observable.

## Important commands

The UI uses commands rather than direct record edits:

| Command | Atomic work |
| --- | --- |
| `createClassSeries` | Validate studio and instructor scope; store template and recurrence rule; generate occurrences |
| `updateOccurrence` | Validate conflicts; write a schedule event; update the occurrence and projections |
| `bookOccurrence` | Lock occurrence; validate eligibility/capacity; create enrollment; debit ledger; emit outbox event |
| `cancelEnrollment` | Evaluate the captured policy; change enrollment; credit refund if eligible; promote waitlist asynchronously |
| `joinWaitlist` | Verify no conflicting active enrollment; add ranked waitlist entry with current eligibility snapshot |
| `recordAttendance` | Set attendance state; make completed-class follow-up eligible |

Every command accepts an idempotency key from the client. Retrying after a network timeout returns the prior result instead of double-booking or double-charging.

## Operational requirements

- Every high-impact change creates an audit log with actor, tenant/studio scope, before/after context, and request ID.
- Managers can see why a session cannot be edited: instructor conflict, room conflict, active bookings, or policy restriction.
- Support can view enrollment and ledger history without seeing payment credentials.
- Notifications have a delivery record and can be retried without repeating a domain action.
- Sensitive data is minimized, encrypted where appropriate, and retained according to a documented policy.

## Test strategy

| Layer | Examples |
| --- | --- |
| Unit | Credit policy, cancellation cutoff, recurrence expansion, time-zone conversion, conflict detection |
| Integration | Locking under concurrent booking attempts, ledger idempotency, waitlist promotion, role-scoped queries |
| End-to-end | Member booking/cancellation flow, partner adds a class, account changes, mobile calendar navigation |
| Scheduled jobs | Reminder timing, expired holds, credit expiration, regeneration after recurrence changes |

See [studio-data-model.md](./studio-data-model.md) for records and constraints, and [studio-behavior-spec.md](./studio-behavior-spec.md) for the highest-risk workflow scenarios.
