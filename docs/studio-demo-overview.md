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
| Partner — Classes and roster | Add, edit, cancel, or manually enroll in a fictional session; inspect availability and roster changes. Schedule conflicts are checked locally. |
| Partner — Staff and roles | Change a fictional staff role and see the permission summary update for that organization. |
| Partner — Account | Open from the name/avatar. Review Jordan Lee’s fictional Form House identity, Partner Admin role, and organization-scoped access; return to the partner desk from the account view. |
| Admin — Overview | Compare fictional platform totals across 30- and 90-day ranges. Charts and labels follow the selected range. |
| Admin — Members | Inspect sample member records, add a support credit where allowed, and toggle a member’s demo status. |
| Admin — Partners | Inspect sample partner records and toggle demo access status. |
| Admin — Support | Select and resolve a sample case. Resolution updates the case and activity record. Operator context demonstrates the approval boundary for credit adjustments. |
| Admin — Roles | Review the fictional operations role and its scope. |
| Admin — Account | Open from the name/avatar. Review Priya Shah’s fictional Set Operations identity, Platform Admin role, and operations scope; return to the admin overview from the account view. |

## Shared behavior and limits

Bookings, seat availability, partner rosters, credit balance, and activity are coordinated in the current page session. Guided tasks point to actual controls, wait for the visitor to act, can be dismissed, and can be restarted. Use the role switch or `?role=partner` / `?role=admin` to open a role-specific starting view.

This is a product concept demo, not a production-ready service. Real identity, authorization, durable audit history, concurrent booking protection, real notifications, billing, and support workflows would require a separate backend and security review.

## Publishing note

Keep `/demo/*` excluded from the public portfolio build until publishing is explicitly approved in the project instructions. Build locally with `npm run build`; do not deploy from this demo task.
