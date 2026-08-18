# Launch Operations Demo Plan

## Product Concept

Build a fictional browser-only product called **Launchline**. It helps a regional operations team prepare several new physical locations to open on schedule. A launch manager can see what is blocked, coordinate people across functions, resolve an exception, and capture the final decision in one place.

This is not a client case study or a reconstruction of past client work. It is an independently designed concept that demonstrates the complexity of a production operational portal: schedules, role-based work, dependencies, approvals, shared records, and clear recovery paths.

## Demonstrated Problem

Opening a location often means that facilities, finance, operations, and training teams each have a partial view of the same work. A missed permit, delayed delivery, or unavailable lead can silently put the opening date at risk.

Launchline makes the opening plan visible as a shared operating record. It answers four practical questions:

1. Which locations are at risk and why?
2. What must happen next, and who owns it?
3. What changes when a dependency slips?
4. Who approved the final decision to open?

## Primary User And Scenario

**Primary user:** regional launch manager responsible for five planned openings.

**Guided scenario:** the manager opens the product three weeks before launch. One location is at risk because the delivery window overlaps the staff training window. The manager reviews the dependency, moves a training session, assigns the follow-up, and records a conditional approval. The portfolio, timeline, and activity history update immediately.

## Product Surface

### 1. Portfolio Command Center

- A dense location table with opening date, readiness score, owner, current blocker, and approval status.
- Summary metrics for on-track locations, blockers due this week, approvals awaiting review, and open exceptions.
- A readiness trend chart and a delivery-versus-training capacity chart using deterministic fictional data.
- Saved views for `All launches`, `Needs attention`, `My work`, and `Approved`.
- Search and filters for region, opening month, status, and owning function.

### 2. Location Workspace

- Persistent location header with opening date, current decision state, readiness score, owner, and risk reason.
- Tabs for `Plan`, `Schedule`, `Dependencies`, `Team`, `Approvals`, and `Activity`.
- Plan tab: grouped checklist with due dates, owners, completion, and blocking relationships.
- Schedule tab: week calendar showing delivery, training, site inspection, and launch events; support rescheduling a fictional event through a dialog.
- Dependencies tab: compact dependency map and an impact panel showing what moves when a prerequisite changes.
- Team tab: role roster, availability, and assignment drawer.
- Approvals tab: decision sheet that summarizes remaining risks, evidence, approver, and condition notes.
- Activity tab: append-only operational history of assignments, schedule changes, exceptions, and approvals.

### 3. Role Inbox

- Switchable roles: `Launch manager`, `Facilities`, `Operations`, `Training`, and `Finance`.
- Each role sees an actionable queue with urgency, location, due date, and the prerequisite that makes the task meaningful.
- Selecting an item deep-links into the relevant tab and highlights the next action.
- Completion and reassignment update the corresponding location plan and activity history.

### 4. Exception Workflow

- An exception drawer for a delayed delivery or failed inspection.
- Required structured choices: severity, affected milestone, new expected date, proposed mitigation, accountable owner, and stakeholders to notify.
- Impact preview: the UI calculates the tasks and events affected by the change from local fixture data.
- Resolve, accept-risk, or escalate decisions produce a dated activity entry and update portfolio health.

### 5. Guided Product Tour

- Starts from a clear “Take the guided scenario” control and may be dismissed at any step.
- The tour navigates to a real record, applies the correct filter, scrolls to the exact control, and uses a contextual popover to explain the next action.
- It waits for the visitor’s completion before advancing.
- Completion returns to the portfolio with an updated readiness score and a concise “what changed” summary.

## Frontend-Only Technical Model

- Astro route with one self-contained TypeScript interaction layer and scoped CSS, following the current static-site pattern.
- Fictional fixture data held in browser memory only. Refresh restores the initial scenario.
- No authentication, API requests, database, analytics, external fonts, AI calls, tokens, or client data.
- State model: locations, milestones, tasks, events, dependencies, people, role inbox items, approvals, exceptions, and activity events.
- Derived selectors calculate readiness, blockers, schedule conflicts, inbox contents, and impacted tasks. No business logic is copied from client systems.
- Use native dialogs for assignment, schedule adjustment, and exception handling; preserve keyboard focus and visible feedback.

## Build Sequence

1. Replace the current vendor-readiness concept with the Launchline command-center shell, fictional fixture data, navigation, and responsive layout.
2. Implement the portfolio table, saved views, filters, and derived readiness metrics.
3. Implement the location workspace with plan, schedule, dependency, team, approvals, and activity tabs.
4. Add role inbox navigation and state synchronization with the workspace.
5. Add schedule adjustment and exception dialogs with impact previews and derived updates.
6. Add the contextual guided scenario and reset behavior.
7. Audit desktop, tablet, and mobile layouts; keyboard flow; dialogs; target sizes; text overflow; and reduced-motion behavior.

## Definition Of Done

- A visitor can understand the operational problem before interacting, then complete one end-to-end exception-resolution flow without instruction outside the product.
- A change made in a dialog is reflected consistently in the portfolio, location workspace, role inbox, readiness score, and activity history.
- The product has enough real interaction to communicate system design skill: filtering, selection, navigation, derived state, updates, dialogs, conflict handling, and an audit trail.
- It remains clearly labeled as a fictional, frontend-only prototype.
- `npm run build` succeeds with no Astro diagnostics. Deployment happens only on an explicit request.
