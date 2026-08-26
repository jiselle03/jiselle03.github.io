# Cadence refinement plan

## Purpose

Cadence is a fictional, frontend-only operations system for teams opening several physical locations. It demonstrates how a vague cross-functional problem becomes a shared operating record: work, dependencies, people, decisions, and an audit trail in one place.

The product should answer four questions immediately:

1. Which opening is at risk?
2. What needs to happen next, and who owns it?
3. What changes if a prerequisite slips?
4. Who made the decision to proceed?

## First-run clarity

A visitor should not need to infer the product from dashboard charts.

On first entry, show a concise **scenario brief** over the real application:

- **Role:** Maya, regional launch manager.
- **Situation:** Harbor Point opens September 26; equipment delivery overlaps staff training.
- **Goal:** Review the impact, move the training window, assign the follow-up, and record the opening decision.

Offer two equal choices:

- `Start guided scenario`: takes the visitor through the live conflict, one action at a time.
- `Explore workspace`: dismisses the brief and leaves the application fully usable.

The brief is a centered dialog on desktop and a bottom sheet on phones. It has no decorative introduction, no more than three short rows, a visible dismiss action, and remembers dismissal for the current browser session. A `Restart scenario` action stays available in the command center.

## Product structure

The current one-page dashboard becomes four product-level views:

| View | Visitor value |
| --- | --- |
| Command Center | See decisions due now and open the highest-impact issue. |
| Portfolio | Compare planned openings by date, readiness, owner, function, and decision state. |
| My Work | See role-specific work with urgency and blocked prerequisites. |
| Decision Log | Review exceptions, approvals, owners, conditions, and dated history. |

Selecting a location opens a persistent workspace with `Plan`, `Schedule`, `Dependencies`, `Team`, `Approvals`, and `Activity` views. The selected location remains visible while the user moves through these views.

## Core interaction

The demo's central scenario is a delivery conflict at Harbor Point:

1. Open the decision due in Command Center.
2. Review the delivery/training overlap in Schedule and its downstream impact in Dependencies.
3. Move the training window and assign the follow-up owner.
4. Record a mitigation, accepted risk, or escalation.
5. See the portfolio, readiness score, role inbox, decision log, and activity record update from the same local state.

This is the proof point. Additional data and charts should support this flow, not compete with it.

## Portfolio and workspace improvements

### Command Center

- Make `Decisions due` the first, action-oriented surface.
- Keep metrics and charts as supporting context.
- Surface deadline, accountable owner, impact, and one next action per decision.

### Portfolio

- Add an opening timeline with readiness bands and risk markers.
- Keep saved views and add filters for date range, risk, function, decision state, and owner.
- Preserve selection when filters change, while clearly explaining when it is outside the active view.

### Location workspace

- Plan: milestone groups, owners, due dates, blocked state, and completion evidence.
- Schedule: a day/week timeline that makes event collisions immediately legible.
- Dependencies: an impact chain showing what will move if a prerequisite moves.
- Team: role roster, availability, and next handoff.
- Approvals: decision sheet with remaining risk, condition, approver, and evidence.
- Activity: append-only operational history that explains why the record changed.

### My Work and Decision Log

- Replace the standalone role selector with a focused work queue.
- Deep-link each item to its task or decision.
- Show decision history as a first-class view, not only as a workspace tab.

## Frontend boundary

- All people, locations, dates, events, and decisions are fictional fixture data.
- State lives in browser memory and resets on refresh.
- No authentication, API calls, database, AI calls, tokens, analytics, or client data.
- Use native dialogs/sheets, visible focus states, keyboard support, and reduced-motion handling.

## Delivery order

1. Replace the long-page information architecture with view state and persistent location context.
2. Add the first-run scenario brief and restartable guided scenario.
3. Rebuild Command Center and the portfolio timeline around decisions and impact.
4. Deepen the location workspace and synchronize derived state across views.
5. Add My Work and Decision Log.
6. Complete the exception flow, responsive polish, and accessibility/design audit.

## Definition of done

- A first-time visitor understands the scenario before interacting and can choose guidance or free exploration.
- The complete conflict-to-decision flow updates every affected surface consistently.
- The product feels like a focused operational application, not a set of dashboard sections.
- The phone experience uses a bottom sheet and linear, thumb-friendly guided flow; desktop uses the same state model without a separate workflow.
- The product remains clearly fictional and frontend-only without repeating that disclaimer throughout the UI.
