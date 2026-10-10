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
| Partner — Classes | Add, edit, or cancel a fictional session; inspect attendance, availability, and recent studio activity. |
| Partner — Members | Review repeat members with bookings at Form House and open the relevant class roster to manage an enrollment. The directory is derived from Form House bookings only; no Set-wide member search is exposed. |
| Partner — Staff | Change fictional staff roles and preview Partner Admin, Front Desk, or Trainer access. These are prototype affordances, not security controls. |
| Partner — Account | Open from the name/avatar. Review Jordan Lee’s fictional Form House identity, Partner Admin role, and organization-scoped access; return to the partner desk from the account view. |
| Admin — Overview | Compare fictional platform totals across 30- and 90-day ranges. Charts and labels follow the selected range. |
| Admin — Members | Inspect sample member records, add a support credit where allowed, and toggle a member’s demo status. |
| Admin — Partners | Inspect sample partner records and toggle demo access status. Partner records stay separate from member support records. |
| Admin — Support | Select and resolve a sample case. Resolution updates the case and activity record. Operator context demonstrates the approval boundary for credit adjustments. |
| Admin — Roles | Review the fictional operations role and its scope. |
| Admin — Account | Open from the name/avatar. Review Priya Shah’s fictional Set Operations identity, Platform Admin role, and operations scope; return to the admin overview from the account view. |

## Shared behavior and limits

Bookings, seat availability, partner rosters, credit balance, and activity are coordinated in the current page session. Guided tasks point to actual controls, wait for the visitor to act, can be dismissed, and can be restarted. Use the role switch or `?role=partner` / `?role=admin` to open and refresh into a role-specific starting view. The Set wordmark returns to the first section in the current workspace: Explore, Classes, or Overview. Member sees “Membership network,” Partner sees “Studio operations,” and Admin sees “Platform operations” with a restrained accent strip to mark the internal Set console.

The notification bell is a role-specific preview: members see enrollment approvals and booking changes, partners see meaningful studio-level approvals or class changes, and admins see escalations and access reviews. It is fictional local copy, not a live notification service.

Partner-assisted enrollment places a 24-hour seat hold and asks the member to approve or decline from the notification panel. Approval confirms the booking and charges credits; decline or expiry releases the seat without charge. The demo also offers a waitlisted member a 24-hour acceptance window rather than silently booking them. A studio can remove a member’s self-booked seat for that studio; the member sees the local outcome and any eligible credit return. These are local scenario transitions, not live messages or account services.

### Enrollment rules

- Members can book available classes themselves.
- Partners can manage enrollment only for their own studio.
- Manual partner enrollment is limited to repeat members already associated with that studio; it does not expose the full Set member database.
- A partner-created enrollment is a 24-hour hold until the member approves it. Approval keeps the seat and charges credits; decline or expiry releases it. No response is not consent.
- A studio may remove a member’s self-booked seat when needed. The member is notified and the credit outcome is recorded.

### Notification rules

- Members receive notifications for approval requests, approval outcomes, studio removals, and important booking changes.
- Partners receive meaningful studio-level events such as approval outcomes, class changes, and roster exceptions—not every routine enrollment.
- Admins receive escalations, expiring approvals, access reviews, and support actions that need platform oversight.
- The demo uses a small, role-specific set of fictional notifications so the bell demonstrates the hierarchy without pretending to be a live service.

This is a product concept demo, not a production-ready service. Real identity, authorization, durable audit history, concurrent booking protection, real notifications, billing, and support workflows would require a separate backend and security review.

## Publishing note

Set Studio is approved for public release at `/demo/studio/`. The public build includes that route and continues to exclude other demo routes until separately approved. Build locally with `npm run build`; publish through the portfolio deploy workflow.
