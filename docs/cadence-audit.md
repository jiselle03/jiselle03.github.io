# Cadence implementation audit

Date: 2026-08-19

## Audit health score

| # | Dimension | Score | Key finding |
| --- | --- | --- | --- |
| 1 | Accessibility | 3/4 | Native dialogs, labels, focus styling, and keyboard tabs are present; the non-modal tour popover needs a clearer relationship to its target. |
| 2 | Performance | 4/4 | Static route, local fixtures, no images, API calls, or heavy dependencies. |
| 3 | Responsive design | 3/4 | Dialogs and the tour adapt to mobile sheets; the long-page information architecture still makes phone navigation expensive. |
| 4 | Theming | 2/4 | Base tokens exist, but many repeated literal values make Cadence hard to evolve as a design system. |
| 5 | Anti-patterns | 2/4 | The dashboard is polished but still presents too many panels and work areas in one long scroll. |
| **Total** | | **14/20** | **Good: address information architecture and token consistency next.** |

## Anti-patterns verdict

**Fail, narrowly.** Cadence does not look like generic AI marketing, but the screen still reads as a dense dashboard demonstration rather than one cohesive operational application. The repeated card/panel treatment and simultaneous display of command center, portfolio, workspace, and inbox dilute the primary decision flow.

## Findings

### [P1] Product-level navigation does not control product-level views

- **Location:** `src/pages/demo/cadence.astro`, sidebar and sequential sections
- **Category:** Responsive / Anti-pattern
- **Impact:** Visitors must scroll through unrelated work areas to understand the application. On phones, this obscures the workflow and makes the interface feel like a website rather than a system.
- **Recommendation:** Implement explicit `Command Center`, `Portfolio`, `My Work`, and `Decision Log` view state while preserving the selected-location workspace context.
- **Suggested command:** `$distill`, `$adapt`

### [P1] First-run brief establishes context but the tour lacks a phone-specific step container

- **Location:** `src/pages/demo/cadence.astro`, `#tour-popover`; `src/styles/cadence.css`, mobile tour rules
- **Category:** Accessibility / Responsive
- **Impact:** The popover becomes a bottom sheet on phone widths, but it remains an `aside` without an explicit step-progress control or a live focus handoff. It can compete with a highlighted control near the bottom of the viewport.
- **Recommendation:** Make each mobile tour step a dedicated bottom-sheet state with a concise progress label, a clear dismiss control, and a target positioned above the sheet before the step appears.
- **Suggested command:** `$onboard`, `$adapt`

### [P2] Cadence tokens are incomplete

- **Location:** `src/styles/cadence.css`
- **Category:** Theming
- **Impact:** Repeated literal borders, backgrounds, and accent values make visual refinement slow and invite inconsistent states.
- **Recommendation:** Consolidate surfaces, borders, risk colors, focus ring, and dialog values into semantic tokens before adding new product views.
- **Suggested command:** `$normalize`, `$extract`

### [P2] Wide portfolio table depends on horizontal scrolling

- **Location:** `src/pages/demo/cadence.astro`, portfolio table; `src/styles/cadence.css`, `table { min-width: 50rem }`
- **Category:** Responsive
- **Impact:** Horizontal scrolling is acceptable for dense data, but it is not a useful primary mobile portfolio view.
- **Recommendation:** Render a compact location list on phones with readiness, date, blocker, and decision state, then retain the table for tablet and desktop.
- **Suggested command:** `$adapt`

### [P3] Scenario brief dismissal treats Escape as completed onboarding

- **Location:** `src/pages/demo/cadence.astro`, `scenarioBrief` close handler; `src/pages/demo/small-walks.astro`, `walkBrief` close handler
- **Category:** Onboarding
- **Impact:** A user who presses Escape will not see the brief again in the current session, even though they did not choose a path.
- **Recommendation:** Persist the seen state only for explicit `Start` and `Explore` actions; keep Escape as a temporary dismissal.
- **Suggested command:** `$onboard`, `$polish`

## Positive findings

- Scenario briefs are concise, describe a real working outcome, and offer equal guided and self-directed paths.
- Cadence and Small Walks both use native dialogs; their first-run content stays inside the product rather than becoming a marketing page.
- The mobile sheet treatment uses safe-area padding, 48px actions, and reduced-motion support.
- `npm run build` completed with zero Astro diagnostics.

## Recommended action order

1. **[P1] `$distill` and `$adapt`** — make Cadence product-level view state explicit, with a compact mobile portfolio list.
2. **[P1] `$onboard` and `$adapt`** — turn phone tour steps into deliberate bottom-sheet states rather than repositioned desktop popovers.
3. **[P2] `$normalize` and `$extract`** — establish semantic Cadence tokens before expanding the view system.
4. **[P3] `$polish`** — correct scenario-brief dismissal semantics and verify dialogs at 375px, tablet, and desktop widths.

Re-run this audit after the navigation and tour changes to measure improvement.
