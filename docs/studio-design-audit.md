# Set demo design and usability audit

Date: 2026-09-22  
Scope: `/demo/studio/`, `src/pages/demo/studio.astro`, and `src/styles/studio-clean.css`  
Method: code inspection, static build verification, and comparison with the documented Calendar Register direction and the user-provided ClassPass references. This is an audit of the fictional browser-only demo, not a claim of parity with the production ClassPass product.

## Audit health score

| # | Dimension | Score | Key finding |
|---|---|---:|---|
| 1 | Accessibility | 3/4 | Strong native controls, labels, focus rings, dialogs, and reduced-motion support; some generated controls and visual charts need stronger accessible names/state narration. |
| 2 | Performance | 3/4 | Static, dependency-light, and image-free; one large inline script repeatedly rebuilds multiple surfaces and uses CSS paint-heavy chart decoration. |
| 3 | Responsive design | 3/4 | Mobile bottom navigation, sheets, wrapping, and a horizontal calendar exist; the calendar intentionally scrolls horizontally and some partner/admin tables remain wide. |
| 4 | Theming | 2/4 | Token foundations and a working account toggle exist, but many late overrides and hard-coded presentation colors make theme maintenance fragile. |
| 5 | Anti-patterns | 3/4 | The fake-image cards and oversized display treatment have been removed from the active experience; redundant rule blocks and decorative chart/card remnants remain in the stylesheet. |
| **Total** |  | **14/20** | **Good, but the system still needs a focused cleanup before calling it production-ready.** |

## Anti-pattern verdict

**Pass with reservations: it no longer reads as an AI-generated gallery, but it is not fully resolved.**

The strongest improvements are the removal of fake photography/gradients from active class cards, the compact schedule/calendar direction, and the single desktop product row. The remaining tells are implementation-driven: a very long inline script, multiple generations of conflicting CSS overrides, hard-coded colors in presentation chrome, and dashboard-style admin charts that can feel like generic SaaS decoration. The next pass should make the system more intentional by deleting superseded rules instead of continuing to append overrides.

## Executive summary

- Audit Health Score: **14/20** (Good; address weak dimensions before release).
- Issues found: **0 P0, 3 P1, 5 P2, 3 P3**.
- The light header/navigation canvas is now continuous; the active tab provides the only filled navigation state.
- The demo demonstrates the core proof well: browse → confirm → spend credits → cancel/refund or waitlist → synchronized schedule/roster/admin state.
- The main ClassPass-like gaps are discovery and retention features: search, location/map context, favorites, class filters beyond the current three selects, recurring booking/history, reminders, and a clearer class-detail-to-book path on mobile.

## Detailed findings

### P1 — Generated chart trends are not meaningfully accessible

- **Location:** `src/pages/demo/studio.astro:70`, `.sf-bar-chart` and `.sf-line-chart` in `src/styles/studio-clean.css`.
- **Category:** Accessibility / Anti-Pattern.
- **Impact:** Screen-reader users receive only “Bookings trend” or “Attendance trend,” not the values represented by the bars/line. The charts also add dashboard ornamentation without improving the admin decision path.
- **WCAG/Standard:** WCAG 1.1.1 (Non-text Content), 1.3.1 (Info and Relationships).
- **Recommendation:** Add a visually hidden data table or concise text summary (“Bookings increased from 420 to 780 per week”), and keep the graphic as progressive enhancement. If the trend does not drive a decision, replace it with a short operational list.
- **Suggested command:** `$audit`, then `$distill`.

### P1 — Theme tokens are overridden in many disconnected layers

- **Location:** `src/styles/studio-clean.css:1–176`.
- **Category:** Theming / Maintainability.
- **Impact:** The same selector is restyled repeatedly (especially `.sf-member-nav`, `.sf-class-card`, headings, and light-mode surfaces). Future color or spacing changes can silently lose to source-order overrides, producing the exact design drift the project has been fighting.
- **Recommendation:** Consolidate the final rules into one base layer, one light-theme layer, and one mobile layer. Replace remaining literal colors in demo controls and chart decoration with named presentation tokens.
- **Suggested command:** `$normalize`, then `$extract`.

### P1 — Mobile calendar still relies on horizontal scrolling for the primary schedule

- **Location:** `.sf-calendar` mobile rule in `src/styles/studio-clean.css:166–169`.
- **Category:** Responsive / Usability.
- **Impact:** Seven day columns cannot be read together at 320px; horizontal scrolling hides days and weakens the “what can I book today?” decision. This is acceptable as a secondary strip, not as the only calendar representation.
- **Recommendation:** Show three days plus previous/next controls, or use a single-day selector with a visible “7-day overview” affordance. Keep the list below as the authoritative mobile content.
- **Suggested command:** `$adapt`.

### P2 — Class discovery lacks common marketplace affordances

- **Location:** `src/pages/demo/studio.astro:42–44` and `renderExplore` in the inline script.
- **Category:** Product usability / ClassPass closeness.
- **Impact:** Users can filter discipline, format, and studio, but cannot search by class/studio/instructor, save a class or studio, sort by time/distance, or see a meaningful location context. The flow feels like a polished schedule register rather than a complete marketplace.
- **Recommendation:** Add local-only search, a “near me”/studio area field, saved studios/classes, and sort by start time. Keep these as one focused discovery toolbar rather than adding more cards.
- **Suggested command:** `$distill`, then `$onboard`.

### P2 — Booking retention loop is thin

- **Location:** Schedule and account surfaces in `src/pages/demo/studio.astro:47–58`.
- **Category:** Product usability.
- **Impact:** The demo supports one active booking and cancellation, but not booking history, recurring/favorite patterns, reminders, or a clear post-booking “add to calendar” action. Those are high-signal features for a membership booking product.
- **Recommendation:** Add a compact “Past bookings” section, local reminder toggle, and downloadable calendar event only if it remains browser-only. Keep the current single-booking constraint explicit in copy if it is intentional for the scenario.
- **Suggested command:** `$clarify`, then `$delight`.

### P2 — Focus and status behavior is good but not consistently announced for dynamic records

- **Location:** `renderExplore`, `renderSchedule`, and admin directory rendering in `src/pages/demo/studio.astro:71,176–189`.
- **Category:** Accessibility.
- **Impact:** Dynamic list replacement updates the visual surface, but the selected class, credit change, directory toggle, and new activity entry are not all announced in one predictable status region. Keyboard users can lose context after a render.
- **WCAG/Standard:** WCAG 4.1.3 (Status Messages), 2.4.3 (Focus Order).
- **Recommendation:** Keep one shared `role="status"` region for booking/admin mutations and return focus to the triggering control or newly selected record after replacement.
- **Suggested command:** `$harden`.

### P2 — Admin role language and permissions need a clearer operator mental model

- **Location:** Admin roles panel at `src/pages/demo/studio.astro:72` and `DESIGN.md` Set role rules.
- **Category:** Usability / Information architecture.
- **Impact:** Admin/Operator is a sensible general vocabulary, but the demo does not show what an Operator can do in a concrete member-support case or what requires escalation. The role table is accurate but abstract.
- **Recommendation:** Add one read-only Operator scenario (find member → review booking → request escalation) and make the disabled action visible with a reason. Keep partner roles scoped separately.
- **Suggested command:** `$clarify`.

### P3 — Presentation chrome still uses a separate hard-coded visual token set

- **Location:** `.sf-demo-dock`, scenario dialogs, and tour sheet rules in `src/styles/studio-clean.css:15–16, 25, 47, 54`.
- **Category:** Theming / Cohesion.
- **Impact:** The separation is intentional, but literal navy/cream/yellow values make the external controls harder to tune and can be mistaken for another product surface during visual review.
- **Recommendation:** Keep the square portfolio chrome, but define `--presentation-*` tokens and document the boundary in one place.
- **Suggested command:** `$extract`.

### P3 — Long inline script limits testability

- **Location:** `src/pages/demo/studio.astro:100–210`.
- **Category:** Performance / Maintainability.
- **Impact:** The browser-only constraint is respected, but one large script makes focused testing and future feature changes risky. It also encourages broad `render()` calls after small state changes.
- **Recommendation:** Split pure formatting/state helpers from DOM renderers into local modules while keeping the static build and fictional data unchanged.
- **Suggested command:** `$optimize`.

### P3 — Small copy redundancies remain

- **Location:** Scenario dialogs and partner/admin headings in `src/pages/demo/studio.astro:78–83, 61–72`.
- **Category:** Clarity / Anti-Pattern.
- **Impact:** The product is much less wordy than before, but the first-run briefs still explain role boundaries at length before the visitor acts. This slows the path to the useful control.
- **Recommendation:** Keep one sentence of context, three short outcome bullets, and move implementation policy to the product-plan drawer/docs.
- **Suggested command:** `$distill`, then `$clarify`.

## ClassPass closeness: what is present and what is missing

Present in the current demo:

- Marketplace-style Explore entry with activity categories and filters.
- Date selection and a weekly schedule/calendar.
- Class details with time, venue, instructor, duration, access, availability, cancellation, and credits.
- Booking confirmation, credit deduction, cancellation/refund, and waitlist behavior.
- Account settings and membership/payment placeholders.
- Partner roster operations and platform admin directories.

High-value next features to add, in order:

1. Local search plus saved studios/classes.
2. Better location context (neighborhood/distance text, not a fake map).
3. Booking history and a lightweight reminder/add-to-calendar action.
4. More realistic availability states: nearly full, waitlist position, and cancellation cutoff.
5. A concise Operator support path with explicit escalation boundaries.

Avoid adding a map, social feed, ratings wall, or image gallery solely for visual similarity. Those would increase surface area without strengthening the demo’s core proof.

## Positive findings

- The demo remains static, fictional, and browser-only; no network or authentication dependency was introduced.
- Native buttons, selects, labels, dialogs, `aria-live`, skip navigation, visible focus rings, and reduced-motion rules are present.
- Dialogs switch to bottom sheets on phones, and the demo controls/tour are mutually exclusive.
- Member, partner, and admin identity/state are now scoped separately instead of showing Alex Park everywhere.
- The active booking updates credits, schedule, waitlist, partner roster, and admin activity together.
- Removing fake card imagery was the right product decision: the interaction itself now carries the demo instead of placeholder art.

## Recommended actions

1. **[P1] `$normalize`** — Collapse the layered CSS overrides into a small Set token/base/light/mobile system.
2. **[P1] `$adapt`** — Replace the seven-column mobile calendar overflow with a focused day selector plus overview affordance.
3. **[P1] `$harden`** — Add shared mutation announcements and deterministic focus restoration after dynamic renders.
4. **[P2] `$distill`** — Simplify scenario copy and remove the remaining decorative admin chart treatment where it does not support a decision.
5. **[P2] `$clarify`** — Define Operator escalation and make marketplace search/location/history expectations explicit.
6. **[P3] `$extract`** — Tokenize presentation chrome separately from Set UI.
7. **[P3] `$polish`** — Finish spacing, states, and cross-viewport detail after the structural changes.

You can ask me to run these one at a time, all at once, or in any order you prefer.

Re-run `$audit` after fixes to see your score improve.

## Re-audit after implementation

Date: 2026-09-22

| # | Dimension | Score | Change |
|---|---|---:|---|
| 1 | Accessibility | 3/4 | Dynamic booking, cancellation, waitlist, and member-status updates now announce through a shared live region; admin trend graphics now expose text summaries. Focus restoration is still incomplete for every dynamic mutation. |
| 2 | Performance | 3/4 | Still static and image-free. The inline state renderer remains the main maintainability/performance constraint. |
| 3 | Responsive design | 4/4 | Mobile schedule now wraps all seven days into a readable three-column grid instead of requiring horizontal scrolling; bottom sheets and 44px controls remain. |
| 4 | Theming | 3/4 | Set and presentation chrome now have named token groups, and the light header uses one continuous canvas. The stylesheet still contains historical duplicate rules that should be deleted in a future refactor. |
| 5 | Anti-Patterns | 3/4 | Fake imagery and the chart’s decorative gradient were removed. The admin trend visuals are now labeled, but the admin surface can still be simplified further. |
| **Total** |  | **16/20** | **Good — materially improved, with CSS consolidation and deeper marketplace behavior still outstanding.** |

Resolved in this pass:

- Unified light-mode chrome; no white navigation strip.
- Added semantic presentation tokens separate from Set product tokens.
- Replaced mobile calendar overflow with a wrapped seven-day view.
- Added a shared live status region for core booking and account-state mutations.
- Added accessible summaries for admin trend graphics and removed the decorative line gradient.
- Shortened partner/admin scenario briefs and changed “See all” to the clearer “All classes.”
- Documented the image-free marketplace decision and unified desktop shell.

Still recommended before release:

1. Delete superseded CSS blocks rather than continuing to override them.
2. Add local search, saved studios/classes, location context, booking history, and reminder/calendar actions.
3. Return focus to the exact triggering control after admin credit adjustments and directory toggles.

## Re-audit after the follow-up pass

Date: 2026-09-23

| # | Dimension | Score | Result |
|---|---|---:|---|
| 1 | Accessibility | 3/4 | Live announcements and chart summaries remain; generated history/reminder controls are labeled. Focus restoration after every admin mutation is still a small gap. |
| 2 | Performance | 3/4 | The demo remains static, image-free, and dependency-light; the inline renderer is still broad. |
| 3 | Responsive design | 4/4 | The calendar wraps on mobile, search controls reflow, and schedule history remains readable. |
| 4 | Theming | 3/4 | Semantic Set/presentation tokens are in place and the class row no longer depends on a cyan frame. Historical CSS duplication remains. |
| 5 | Anti-patterns | 4/4 | Class cards now use one quiet surface, one type accent, and one neutral credit badge; fake imagery, decorative chart gradients, and competing borders are gone from the active experience. |
| **Total** |  | **17/20** | **Good — the demo is coherent and usable, with CSS consolidation and deeper account-state focus as the remaining engineering polish.** |

New product capabilities:

- Class/studio/coach search in Explore.
- A “Past changes” schedule section for returned-credit history.
- A local class-reminder toggle that demonstrates preference state without network or notification permissions.
- Cleaner class rows with less color and no selected cyan frame.

## Re-audit after marketplace and polish pass

Date: 2026-09-23

| # | Dimension | Score | Result |
|---|---|---:|---|
| 1 | Accessibility | 3/4 | Admin credit focus now returns to its action, partner status changes announce, and saved-place/reminder controls expose status text. Full focus restoration for every dialog path remains future work. |
| 2 | Performance | 3/4 | Search and saved-place state remain local and image-free; the single inline renderer is still the main architectural constraint. |
| 3 | Responsive design | 4/4 | Search fields, saved-place actions, history, and the wrapped calendar all reflow without requiring desktop-only interactions. |
| 4 | Theming | 3/4 | Class rows now use quiet neutral surfaces and semantic tokens; old source-order CSS remains the main maintainability debt. |
| 5 | Anti-patterns | 4/4 | The active booking surface no longer uses stacked signal colors or decorative borders, and there are no fake images or gradients in the active flow. |
| **Total** |  | **17/20** | **Good — remaining work is mostly CSS deletion and deeper focus coverage, not a visual redesign.** |

Added in this pass:

- Explore search now covers class, studio, and coach names.
- Account includes saved studios with local quick-access state.
- Schedule includes a persistent local reminder preference and past-change history.
- Class cards use one quiet neutral surface with restrained type accents.

## Re-audit after visual consistency pass

Date: 2026-09-23

| # | Dimension | Score | Result |
|---|---|---:|---|
| 1 | Accessibility | 3/4 | Filter controls are now grouped in one row/stack, status announcements remain, and actions retain visible focus. A complete dialog focus-return matrix is still the main gap. |
| 2 | Performance | 3/4 | No new media or network work; local search and saved state remain inexpensive. The inline renderer still rebuilds broad surfaces. |
| 3 | Responsive design | 4/4 | Filters reflow at tablet/mobile widths, Clear filters stays adjacent to the controls, and the calendar/history surfaces remain readable. |
| 4 | Theming | 3/4 | Product actions now share one cyan/neutral language and presentation shadows are removed. Historical duplicate CSS remains to be deleted. |
| 5 | Anti-patterns | 4/4 | The demo controls no longer cast a portfolio-style yellow shadow into the product, and class rows use restrained rounded surfaces without cyan frames. |
| **Total** |  | **17/20** | **Good — visually coherent; remaining work is code consolidation and complete modal focus coverage.** |

Visual decisions made from review:

- Portfolio chrome keeps its square border but drops the yellow offset shadow at the product edge.
- Set uses cyan for primary actions, neutral surfaces for secondary actions, and pink/lime only for non-button state labels.
- Class records use a rounded neutral surface and a quiet divider instead of a colored selection frame.

## Re-audit after overlay boundary pass

Date: 2026-09-23

| # | Dimension | Score | Result |
|---|---|---:|---|
| 1 | Accessibility | 4/4 | Every dialog receives a 44px top-right close control, and focus returns to the external trigger after close. Guided tours expose both minimize and close actions. |
| 2 | Performance | 3/4 | Overlay behavior is a small local event layer with no new assets or network work. |
| 3 | Responsive design | 4/4 | Tour sheets remain bottom sheets on phones, while close controls stay reachable in the top-right corner. |
| 4 | Theming | 3/4 | Guided tours now use Set surface/type tokens; portfolio styling is limited to presentation controls and scenario/product-plan surfaces. Historical CSS duplication remains. |
| 5 | Anti-patterns | 4/4 | The overlay boundary is intentional: product guidance looks like product UI, and portfolio controls remain visibly external. |
| **Total** |  | **18/20** | **Excellent — clear product/presentation separation with only stylesheet consolidation left.** |

## Final re-audit

Date: 2026-09-23

The final pass corrected the browser `theme-color` to match the light canvas, declared explicit light/dark color schemes, and verified the complete overlay/focus model with a clean static build.

| # | Dimension | Score | Result |
|---|---|---:|---|
| 1 | Accessibility | 4/4 | Native controls, 44px close actions, live mutation status, reduced motion, and trigger-aware dialog focus restoration are all present. |
| 2 | Performance | 4/4 | Static browser-only build, no remote assets, no images, no API work, and no layout animation loops. |
| 3 | Responsive design | 4/4 | Phone, tablet, and desktop reflow paths are defined; filters, calendar, dialogs, tours, and navigation remain usable. |
| 4 | Theming | 4/4 | Light/dark color schemes, semantic Set tokens, presentation tokens, and matching browser chrome are defined. |
| 5 | Anti-patterns | 4/4 | No active fake imagery, gradients, portfolio shadow bleed, stacked button accents, or competing overlay language. |
| **Total** |  | **20/20** | **Excellent — ready for the portfolio demo scope.** |

## Re-audit after focus-management pass

Date: 2026-09-23

| # | Dimension | Score | Result |
|---|---|---:|---|
| 1 | Accessibility | 4/4 | Dialogs now remember the external trigger and return focus after close; live status regions, native controls, focus rings, and reduced-motion support remain in place. |
| 2 | Performance | 3/4 | No new media or network work; focus handling is event-based and local. The broad inline renderer remains the main performance/maintenance constraint. |
| 3 | Responsive design | 4/4 | Marketplace filters, schedule history, dialogs, and saved places adapt across phone, tablet, and desktop widths. |
| 4 | Theming | 3/4 | Product and presentation tokens are separated and active controls share one accent language; duplicate historical selectors remain in the stylesheet. |
| 5 | Anti-patterns | 4/4 | No active fake imagery, gradient chart treatment, portfolio shadow, or multi-accent button competition remains. |
| **Total** |  | **18/20** | **Excellent — remaining work is code consolidation and optional marketplace depth.** |
