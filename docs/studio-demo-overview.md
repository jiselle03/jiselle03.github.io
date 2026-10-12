# Set · Studio Roster Desk demo

## Premise

Set is a fictional class-booking and studio-operations product. This demo shows how a member, a studio partner, and Set operations work with the same local schedule and account state. Each role opens with one short guided task; Members can load sample activity instead of starting from an empty schedule.

All names, studios, schedules, balances, support requests, and activity are invented. State exists only in the browser and resets on refresh or when the scenario is restarted. The demo has no server, account login, API, real messaging, payment processing, external analytics, or persistent storage. Password and payment settings are explanatory previews only. Member sample activity is available from Demo Controls; it fills Schedule with a confirmed group class, a partner-held group class awaiting approval, and a waitlist entry. The guided scenario still starts cleanly.

## Roles and views

| Role / view | What the visitor can do |
| --- | --- |
| Member — Explore | Browse and filter dated class sessions, inspect class and studio details, book with fictional credits, or join a waitlist for a full session. |
| Member — Schedule | Select a day to review that date’s confirmed, approval-pending, waitlisted, cancelled, and expired enrollments. The sample activity option gives visitors confirmed, held, and waitlisted group-class records to explore; cancel a booking to see its credit outcome. |
| Member — Account | Open from the name/avatar in the top-right header (not a workspace tab). Edit Alex’s fictional profile for the current page session, switch theme, and inspect non-interactive password/payment previews. Use workspace navigation to leave Account. |
| Partner — Classes | Browse classes by date, add a weekly or one-off class, edit class details, cancel a single occurrence, inspect that day’s roster, request repeat-member enrollment, remove a member, and review studio activity. |
| Partner — Members | Review repeat members with bookings at Form House and open the relevant class roster to manage an enrollment. The directory is derived from Form House bookings only; no Set-wide member search is exposed. |
| Partner — Staff | Assign fictional Form House staff to Front Desk or Trainer and configure each role’s class, roster, attendance, and staff-management permissions. Partner Admin has fixed full access. Changes are local and apply only to Form House; Jordan remains signed in as Partner Admin. |
| Partner — Account | Open from the name/avatar. Review Jordan Lee’s fictional Form House identity, Partner Admin role, and organization-scoped access. Use partner navigation to leave Account. |
| Admin — Overview | Compare fictional platform totals across 30- and 90-day ranges. Charts and labels follow the selected range. The Admin walkthrough continues from the range selector to Alex’s member record and a reasoned support-credit adjustment. |
| Admin — Members | Inspect sample member records, add a support credit where allowed, and toggle a member’s demo status. |
| Admin — Partners | Inspect sample partner records and toggle demo access status. Partner records stay separate from member support records. |
| Admin — Support | Select and resolve a sample case as the signed-in Set Admin. Resolution updates the case and activity record. The page does not offer role selection or impersonation. |
| Admin — Roles | Review fixed full Admin access and configure Operator view/edit permissions for member records, partner accounts, support cases, credit adjustments, and role permissions. Changes are local configuration examples; they do not change the current Admin session or enforce authorization. |
| Admin — Account | Open from the name/avatar. Review Priya Shah’s fictional Set Operations identity, Platform Admin role, and operations scope. Use Admin navigation to leave Account. |

## Shared behavior and limits

Class definitions, dated occurrences, enrollment records, seat availability, partner rosters, credit balance, and activity are coordinated in the current page session. Weekly classes recur; partners can cancel one date without cancelling the series. Guided tasks point to actual controls, wait for the visitor to act, can be dismissed, and can be restarted. Use the role switch or `?role=partner` / `?role=admin` to open and refresh into a role-specific starting view. The Set wordmark returns to the first section in the current workspace: Explore, Classes, or Overview. Member sees “Membership network,” Partner sees “Studio operations,” and Admin sees “Platform operations” with a restrained accent strip to mark the internal Set console.

The notification bell is a role-specific preview: members see enrollment approvals and booking changes, partners see meaningful studio-level approvals or class changes, and admins see escalations and access reviews. Sample member approval actions are tied to the loaded enrollment, so approving it updates schedule, credits, seat availability, and the partner roster together. It is fictional local copy, not a live notification service.

Partner-assisted enrollment places a 24-hour seat hold and asks the member to approve or decline from the notification panel. Approval confirms the booking and charges credits; decline or expiry releases the seat without charge. The demo also offers a waitlisted member a 24-hour acceptance window rather than silently booking them. A studio can remove a member’s self-booked seat for that studio; the member sees the local outcome and any eligible credit return. These are local scenario transitions, not live messages or account services.

### Enrollment rules

- Members can book available classes themselves.
- Partners can manage enrollment only for their own studio.
- Manual partner enrollment is limited to repeat members already associated with that studio; it does not expose the full Set member database.
- A partner-created enrollment is a 24-hour hold until the member approves it. Approval keeps the seat and charges credits; decline or expiry releases it. No response is not consent.
- A studio may remove a member’s self-booked seat when needed. The member is notified and the credit outcome is recorded.
- Enrollment history is retained as cancelled or expired instead of being deleted. A cancellation affects one dated occurrence, not every future date in a weekly series.
- Waitlists are ordered per dated occurrence. When a seat opens, the next member receives a 24-hour offer that must be accepted; declining or timing out releases the seat and moves the queue forward.
- Admin credit changes and enrollment corrections require a reason and add a local activity entry. Member active/inactive status remains an Admin-only decision.

### Notification rules

- Members receive notifications for approval requests, approval outcomes, studio removals, and important booking changes.
- Partners receive meaningful studio-level events such as approval outcomes, class changes, and roster exceptions—not every routine enrollment.
- Admins receive escalations, expiring approvals, access reviews, and support actions that need platform oversight.
- The demo uses a small, role-specific set of fictional notifications so the bell demonstrates the hierarchy without pretending to be a live service.

This is a product concept demo, not a production-ready service. Real identity, authorization, durable audit history, concurrent booking protection, real notifications, billing, and support workflows would require a separate backend and security review.

### Role and permission model

- The active Admin workspace represents Priya Shah as a Set Admin. Support actions and access are based on that identity; visitors cannot switch the Support screen to an Operator persona.
- Admin’s platform permissions are fixed at full access. The Roles page lets the Admin configure the fictional Operator role’s view/edit grants, including keeping credit changes and role management restricted.
- Partner staff permissions are configured separately for Form House. Partner Admin retains full access; Front Desk and Trainer grants can be adjusted for classes, rosters, attendance, and staff roles. Member staff assignments select one of those roles.
- Permission edits are browser-local prototypes to explain the product model. They reset with the scenario and do not impersonate users, restrict the current Admin/Partner Admin, or provide production authorization.

## Publishing note

Set Studio is approved for public release at `/demo/studio/`. The public build includes that route and continues to exclude other demo routes until separately approved. Build locally with `npm run build`; publish through the portfolio deploy workflow.
