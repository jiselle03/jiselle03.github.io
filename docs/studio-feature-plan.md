# Set demo — booking and permissions roadmap

This plan borrows the tutoring portal’s useful product patterns: explicit booking states, conflict checks, preserved choices, role-scoped actions, admin overrides with reasons, and an operation history. It deliberately excludes resource management, authentication, server APIs, real payments, and real messaging. The Set demo remains a static, fictional browser experience.

## Current baseline

- The page has Member, Partner, and Admin views with local scenario state.
- Self-directed Member entry can load a linked example week with a confirmed group class, a partner approval hold, and a waitlist entry; the guided flow remains a clean booking exercise.
- Partner roster visibility is scoped to Form House. The role preview distinguishes Partner Admin, Front Desk, and Trainer.
- Enrollment records are keyed to dated occurrences. Weekly class definitions support one-off dates and occurrence-level cancellation exceptions.
- Members can keep multiple bookings, see dated confirmed/pending/waitlisted/past states on the selected Schedule day, and cancel one occurrence without deleting its history.
- Partner-assisted enrollment is limited to the represented repeat member, reserves a seat for 24 hours, and requires affirmative approval. Credits are charged only on approval; decline or expiry releases the seat.
- Waitlists have per-occurrence ordering. When a seat opens, the next entry receives a 24-hour approval offer; rejection/expiry leaves history and advances the queue.
- Partners see date-filtered rosters and can remove a member booking for their own studio. Admin credit and enrollment corrections require a reason and appear in local activity.
- Pure policy helpers cover occurrence generation, role × action × studio scope, repeat-member eligibility, approval transitions, queue ordering, retained removal outcomes, and reasoned credit adjustments.
- This is still an interaction prototype, not a secure policy implementation. Class capacity and seeded attendance are simplified local fixtures; there is no durable audit log, server concurrency control, or persistent state.

## Remaining product slices

### 1. Occurrence and policy hardening

- Expand weekly definitions into a visible bounded date range rather than interpreting them from weekday fields at render time.
- Capture the cancellation policy and class price on each enrollment so later class edits cannot rewrite an existing booking’s terms.
- Keep capacity and roster totals occurrence-based across member, partner, cancellation, waitlist, and admin correction flows; seeded attendance remains simplified local fixture data.
- Validate schedule conflicts against actual local start/end datetimes, including sessions crossing midnight and daylight-saving boundaries if new regions are added.

### 2. Better role rules and operations

- Add assignment-aware Trainer access (classes assigned, not every studio roster) and clear “not allowed” feedback.
- Give Partner Admin a small request/review queue for enrollment and cancellation exceptions without exposing platform-wide member status.
- Add explicit Admin support cases and a reasoned approval path for sensitive actions, keeping member status changes platform-only.
- Scope notification history to the action and actor, and allow the visitor to mark items read for a more realistic local flow.

### 3. Integration and resilience coverage

- DOM-level tests now carry a Partner hold through Member approval, credit deduction, and the Partner roster; a sample-activity test also covers confirmed, pending, and waitlisted records across the rendered schedule. Extend this coverage to independent dates of the same weekly class, cancellation of one occurrence, multiple simultaneous holds, and waitlist advancement by exact occurrence.
- Verify admin adjustments, status changes, and enrollment corrections retain actor + reason in every affected surface.
- Reset while each pending state exists; cover long names, empty roster, full occurrence, low credits, same-time conflicts, and dates crossing a week boundary.
- Before calling the demo launch-ready, do a browser pass for keyboard-only use, dialog focus/Escape, screen-reader announcements, 320px phone, tablet, desktop, 200% zoom, and reduced motion. Current automated checks are code/build-level; they do not replace this manual pass.

## Deliberate product decisions

- Partners may not search all Set members by member ID. A member must already have a relationship with the studio for assisted enrollment.
- Partner-created enrollment is a request, not an assumed booking. No response means the hold expires.
- Admin exceptions require a reason and visible history.
- No production identity, authorization, billing, messaging, or persistence is simulated as real. If the demo starts implying those guarantees, make the limitation explicit or remove the control.
