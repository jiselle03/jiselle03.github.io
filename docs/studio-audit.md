# Set demo audit

## Scope and result

Code-level review of the static Set demo, plus local Chrome viewport checks at 320px, 390px, and 1512px. Keyboard-only flow, screen-reader output, 200% zoom, tablet width, and physical-device behavior remain unverified; this is not release certification.

| Dimension | Score | Basis |
| --- | ---: | --- |
| Accessibility | 3/4 | Native controls, visible focus, named icon buttons, and notification focus handling are present; full keyboard and screen-reader behavior remains unverified. |
| Performance | 3/4 | Static output with no service calls; the main client script remains large and tightly coupled. |
| Theming | 3/4 | The palette is token-led; layered overrides and some hard-coded values remain. |
| Responsive design | 4/4 | Checked 320px, 390px, and 1512px in Chrome: no horizontal overflow; booking CTA, guide sheet, notifications, and role switch remain usable. Tablet, zoom, and physical-device checks remain. |
| Anti-patterns | 3/4 | Distinctive product identity, no AI-style gradients or metric wall in the core workflow; some static sample metrics and legacy state remain. |
| **Total** | **16/20** | **Good foundation; remaining points are mostly script modularity, full assistive-technology verification, and layered CSS.** |

This score measures the audit skill’s five technical/design dimensions, not product completeness by itself. Local browser viewport checks were performed, but this remains a code-level audit rather than a release certification.

## Changes in this pass

- Partner-assisted enrollment now creates a 24-hour pending seat hold for the represented repeat member. Alex can approve or decline from the notification panel; credit is charged only on approval. Decline or expiry releases the seat.
- Approval rechecks the current balance and schedule conflicts, so a booking made during the hold can prevent acceptance without silently charging credits.
- Partners receive a local approval/decline/expiry outcome. Pending holds are visible in the roster and can be released by the studio.
- Waitlist promotion now offers a released seat for 24 hours instead of silently enrolling the member. Only one waitlist position is represented in this demo.
- Approval/decline/expiry, member cancellation, and studio cancellation now use shared pure transitions. Tests verify credit, seat, and remaining-booking outcomes; the UI consumes those transition results.
- Member cancellation, partner removal, and studio cancellation resolve booking records, update seat availability, and display member-facing outcomes. Cancelling one booking preserves other confirmed bookings.
- Role labels now match the task: Member = “Membership network,” Partner = “Studio operations,” Admin = “Platform operations.” The internal Admin view keeps a restrained accent strip.
- Role selection continues to be shareable and refresh-safe through `?role=partner` and `?role=admin`; a separate static path for each role would add build/routing overhead without a current user benefit.
- Removed the duplicate activity shortcut row from Explore; the existing discipline filter remains the single way to narrow by class type.
- Made phone class rows a single readable line of time, class details, and price; removed the decorative poster row that had forced narrow titles into a second grid row.
- Kept first-run guides expanded on phones so “Explore on my own” stays visible, offset the sheet above fixed navigation, and add temporary scroll room so guided booking controls can be brought above it.
- Moved the mobile demo switcher away from the Set wordmark and made it scroll with the page rather than cover content. Notifications now open directly below the header with a viewport-bounded scroll region and focus on Close.
- Corrected the member guide’s weekday mismatch: when the 1:1 class is not on the selected day, the guide points to the day arrows, selects the correct class after the visitor reaches Thursday, then points to its booking action.
- Added Partner workspace navigation for Classes, studio-scoped Members, and Staff. The Members list is derived from this studio’s enrollment records and links into class-roster management.
- The Set wordmark now returns to each role’s first workspace section. Admin refreshes to Overview; Partner refreshes to Classes.
- Fixed Admin’s initial guide landing: the default guide now points to the visible date-range control on Overview; the support-credit scenario opens the Members directory before targeting its action.

## Remaining findings

### P1 — Before calling the role workflows complete

- **[P1] Rendered cross-role flow lacks an executing UI integration test.** Location: inline script in `src/pages/demo/studio.astro`. Pure transitions are now behavior-tested, but source-contract tests do not prove that switching Partner → Member, activating notification controls, and switching back keeps Schedule, roster, capacity, credits, and notification count synchronized. Add a DOM/browser integration test for that sequence.
- **[P1] Assistive-technology and keyboard verification remains outstanding.** The phone and desktop layouts were checked in Chrome, but keyboard-only completion, reduced-motion behavior, screen-reader announcements, tablet, 200% zoom, and physical-device behavior were not verified. Complete those checks before treating the demo as publish-ready.

### P2 — Follow-up

- Admin dashboard totals remain fixed sample values. Prefer a compact support queue with counts derived from local demo records over decorative metrics.
- Admin’s “operator context” approval boundary disables the credit action but does not create a request/review/decision flow.
- Split the large page script into view rendering and tested transitions so Member, Partner, and Admin surfaces share one enrollment source of truth without compatibility pointers.
- Partner enrollment still represents Alex as the one manually enrollable repeat member, while the new directory shows the other fictional studio booking histories. Waitlist state represents one active position. Keep these scenario limits explicit, or add a multi-member approval model and ordered queue before presenting either as complete capabilities.
- Finish browser checks at tablet and 200% zoom, plus keyboard-only, reduced-motion, screen-reader navigation, and at least one physical phone before publishing.

## Testing and verification

- `npm run build` — passed; Astro check reported 0 errors, warnings, or hints.
- `npm run test:unit` — passed; Astro check reported 0 errors, warnings, or hints, and Vitest passed 34 tests across 2 files.
- `git diff --check` — passed.
- Chrome viewport checks — passed at 320px, 390px, and 1512px; no horizontal overflow. Verified Member booking, Partner add-class, and Admin support-credit targets are visible above their phone guide sheets; notifications stay below the mobile header with focus on Close.
- Keyboard-only and assistive-technology audit — not performed.

Automated tests cover duplicate/overlap/credit/capacity booking policy, partner role and studio scope, approval/decline/expiry helper behavior, readable first-run dialogs and icon controls, workspace landmarks, schedule days, notification decisions, roster guards, cancellation, and responsive guide/card contracts. The critical remaining gap is executing the rendered cross-role data transition flow rather than checking its source text.

## Positive findings

- The demo remains static, fictional, browser-only, and free of service calls.
- Member, studio-partner, and Set-platform identities are distinct, and their labels now describe their actual work.
- Class price, access, readiness, availability, and cancellation terms sit beside the booking decision.
- The 24-hour approval rule treats silence as expiry, not consent, and defers credit charge until acceptance.
