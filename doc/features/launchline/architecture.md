# Launchline Architecture

## Context

Static Astro site. The demo is one browser-only route with TypeScript interaction and scoped CSS. There is no authentication, server state, API, database, or external dependency.

## Local State

| Model | Purpose | Source |
| --- | --- | --- |
| Location | Opening date, status, owner, readiness, and blocker | 01:4-7 |
| Task | Owner, due date, status, and prerequisite | 02:4-7 |
| Event | Scheduled work with an optional conflict | 02:10-13 |
| Exception | Severity, impact, mitigation, owner, and decision | 03:4-7 |
| Approval | Approver, condition, and decision state | 02:16-19, 03:10-13 |
| Activity event | Dated record of a user action | 02:4-7, 03:4-7 |

All models begin as fictional fixtures and reset on page refresh. Derived selectors calculate readiness, visible locations, role inboxes, task impact, and approval availability.

## Interaction Boundaries

- **Portfolio controller:** filters locations, manages selection, and communicates an empty or out-of-view state. Sources: 01:4-17.
- **Workspace controller:** presents location tabs and synchronizes task assignment, schedule conflict, approval, and activity changes. Sources: 02:4-19.
- **Exception controller:** validates a decision, previews local impacts, and applies a resolve or accept-risk outcome. Sources: 03:4-19.
- **Tour controller:** directs the visitor through a selected exception record, waits for each action, and can stop without changing state.

## UI Structure

- `src/pages/demo/launchline.astro`: route, fixtures, derived state, and interactions.
- `src/styles/launchline.css`: responsive dashboard tokens, layout, controls, dialog, and tour styles.
- The existing vendor-readiness route remains untouched until Launchline is ready to replace it.

## Key Decisions

- Use one selected-location source of truth so changes are reflected consistently in the portfolio, workspace, inbox, and activity history.
- Use native dialogs for changing an assignment, event timing, or exception decision to keep focus behavior reliable.
- Model an approval as unavailable while a blocker is unresolved; accepting risk changes the condition rather than hiding the blocker.
- Label the demo as fictional and frontend-only in the product chrome.
