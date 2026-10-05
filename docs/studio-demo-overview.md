# Set · Studio Roster Desk demo

## Premise

Set is a fictional class-booking and studio-operations product. This demo shows how a member, a studio partner, and Set operations work with the same local schedule and account state. Each role opens with one short guided task; “Explore on your own” is the immediate escape hatch.

All names, studios, schedules, balances, support requests, and activity are invented. State exists only in the browser and resets on refresh or when the scenario is restarted. The demo has no server, account login, API, real messaging, payment processing, analytics, or persistent storage. Password and payment settings are explanatory previews only. The guide can be minimized, exited, or replaced with open exploration via “Explore on my own.”

## Roles and views

| Role / view | What the visitor can do |
| --- | --- |
| Member — Explore | Browse and filter the weekly class catalog, inspect class and studio details, book with fictional credits, join a waitlist, or save a studio locally. |
| Member — Schedule | Review the booking, see its cancellation cutoff, cancel it, and observe whether credits are returned. A reminder preference is a local demo setting, not a notification. |
| Member — Account | Open from the name/avatar in the top-right header (not a workspace tab). Edit Alex’s fictional profile for the current page session, switch theme, and inspect non-interactive password/payment previews. |
| Partner — Classes and roster | Add, edit, cancel, or manually enroll in a fictional session; remove an existing enrollee; inspect availability and roster changes. Manual enrollment is limited to members already associated with that studio. Schedule conflicts are checked locally. |
| Partner — Staff and roles | Change a fictional staff role and see the permission summary update for that organization. |
| Partner — Account | Open from the name/avatar. Review Jordan Lee’s fictional Form House identity, Partner Admin role, and organization-scoped access; return to the partner desk from the account view. |
| Admin — Overview | Compare fictional platform totals across 30- and 90-day ranges. Charts and labels follow the selected range. |
| Admin — Members | Inspect sample member records, add a support credit where allowed, and toggle a member’s demo status. |
| Admin — Partners | Inspect sample partner records and toggle demo access status. Partner records stay separate from member support records. |
| Admin — Support | Select and resolve a sample case. Resolution updates the case and activity record. Operator context demonstrates the approval boundary for credit adjustments. |
| Admin — Roles | Review the fictional operations role and its scope. |
| Admin — Account | Open from the name/avatar. Review Priya Shah’s fictional Set Operations identity, Platform Admin role, and operations scope; return to the admin overview from the account view. |

## Shared behavior and limits

Bookings, seat availability, partner rosters, credit balance, and activity are coordinated in the current page session. Guided tasks point to actual controls, wait for the visitor to act, can be dismissed, and can be restarted. Use the role switch or `?role=partner` / `?role=admin` to open a role-specific starting view.

The notification bell is a role-specific preview: members see enrollment approvals and booking changes, partners see meaningful studio-level approvals or class changes, and admins see escalations and access reviews. It is fictional local copy, not a live notification service.

For a production enrollment flow, a partner-created seat is held for 24 hours and requires member approval. No response releases the hold; it is never treated as silent approval. A studio can remove a member’s self-booked seat for that studio, with a credit outcome and member notification recorded.

### Enrollment rules

- Members can book available classes themselves.
- Partners can manage enrollment only for their own studio.
- Manual partner enrollment is limited to repeat members already associated with that studio; it does not expose the full Set member database.
- A partner-created enrollment is a 24-hour hold until the member approves it. Approval keeps the seat; denial or expiry releases it.
- A studio may remove a member’s self-booked seat when needed. The member is notified and the credit outcome is recorded.

### Notification rules

- Members receive notifications for approval requests, approval outcomes, studio removals, and important booking changes.
- Partners receive meaningful studio-level events such as approval outcomes, class changes, and roster exceptions—not every routine enrollment.
- Admins receive escalations, expiring approvals, access reviews, and support actions that need platform oversight.
- The demo uses a small, role-specific set of fictional notifications so the bell demonstrates the hierarchy without pretending to be a live service.

This is a product concept demo, not a production-ready service. Real identity, authorization, durable audit history, concurrent booking protection, real notifications, billing, and support workflows would require a separate backend and security review.

## Publishing note

Keep `/demo/*` excluded from the public portfolio build until publishing is explicitly approved in the project instructions. Build locally with `npm run build`; do not deploy from this demo task.
