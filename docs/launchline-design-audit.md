# Cadence Design Audit

Date: 2026-08-18

## Audit Health Score

| Dimension | Score | Key finding |
| --- | --- | --- |
| Accessibility | 3/4 | Labels, dialogs, tabs, and focus styles exist; portfolio rows are keyboard-focusable table rows rather than native controls. |
| Performance | 4/4 | Static output, small in-memory fixtures, no media, external fonts, or network calls. |
| Responsive design | 3/4 | Grid layouts collapse cleanly; the data table intentionally scrolls, but several compact controls remain below a 44px touch target. |
| Theming | 3/4 | A coherent corporate palette exists, but repeated hard-coded values prevent the status system from being truly token-driven. |
| Anti-patterns | 3/4 | This reads as an operational tool rather than a generic portfolio; its visual rhythm is still too regular and uses almost entirely square surfaces and single-hue chart bars. |
| **Total** | **16/20** | **Good: focused visual and interaction refinement needed.** |

## Anti-Patterns Verdict

**Pass, with visible polish gaps.** Launchline avoids marketing cards, gradients, decorative effects, and generic hero composition. The dashboard is specific and dense enough to communicate an operational use case. The main remaining tell is uniformity: most surfaces have the same sharp treatment, status colors are underused, and the chart does not convey different operational states.

## Findings

### P1: Portfolio selection uses non-interactive table rows

- **Location:** `src/pages/demo/launchline.astro`, portfolio row renderer
- **Category:** Accessibility
- **Impact:** A focusable `tr` is not a reliable interactive pattern for assistive technology. It makes the selected location action less discoverable and can produce inconsistent keyboard behavior.
- **Recommendation:** Render a native button inside the location cell, or use a list/grid structure with native buttons for selectable records.

### P1: Stale prototype copy weakens product credibility

- **Location:** `src/pages/demo/launchline.astro`, selected-location preview
- **Category:** Content / Anti-pattern
- **Impact:** “Workspace details arrive in the next build slice” contradicts the now-complete workspace and exposes implementation scaffolding to visitors.
- **Recommendation:** Replace it with decision-specific copy derived from the selected record.

### P2: Status color is too narrow

- **Location:** `src/styles/launchline.css`, metrics, readiness chart, and schedule cards
- **Category:** Theming / Visual hierarchy
- **Impact:** Blue is used for nearly every neutral and positive signal. A visitor cannot scan healthy, attention, approved-with-risk, and resolved states quickly.
- **Recommendation:** Introduce semantic tokens for informational, healthy, attention, and decision states; use them in the bar chart, metric accents, progress tracks, and dependency indicators.

### P2: Surface geometry is overly sharp and uniform

- **Location:** `src/styles/launchline.css`, panels, rows, dialogs, and buttons
- **Category:** Visual hierarchy
- **Impact:** The all-square system feels rigid and gives equal visual weight to every object.
- **Recommendation:** Use a restrained 4px-6px radius for interactive controls, data cards, dialogs, and data rows. Keep major section containers more architectural and less rounded.

### P2: Several controls miss the intended touch target

- **Location:** `src/styles/launchline.css`, `.ll-filter`, `.ll-advanced-filters select`, `.ll-advanced-filters button`, `.ll-empty button`, `.ll-out-of-view button`
- **Category:** Responsive / Accessibility
- **Impact:** 40px targets are less forgiving on touch devices.
- **Recommendation:** Raise primary and filter controls to 44px while maintaining the existing fixed layout.

### P3: Program data does not fully support the operational story

- **Location:** `src/pages/demo/launchline.astro`, command-center chart and metrics
- **Category:** Visual hierarchy / Content
- **Impact:** The six bars only show aggregate readiness. The scenario mentions delivery, training, approvals, and risk, but the upper dashboard does not show that mix.
- **Recommendation:** Add a compact function-readiness breakdown and use varied bar/status colors to distinguish healthy progress, attention, and decision-gated work.

### P3: Back navigation previously looked like a personal profile label

- **Location:** `src/pages/demo/launchline.astro`, top bar
- **Category:** Navigation clarity
- **Impact:** The old “Jiselle Liu” link did not make its destination or role clear.
- **Recommendation:** Use “Back to portfolio.” Implemented in this pass.

## Positive Findings

- The product makes a specific operational problem visible before asking the visitor to interact.
- Fixture-driven state updates travel through portfolio, workspace, inbox, readiness, approvals, and activity history.
- The fictitious-data boundary is visible in the product chrome.
- Dialog forms have labels and the guided flow can be dismissed.
- Mobile breakpoints collapse major multi-column layouts without hiding product functionality.

## Recommended Next Pass

1. **P1 `harden`**: replace focusable table rows and stale prototype copy.
2. **P2 `normalize`**: centralize semantic state tokens and standardize 44px interactive targets.
3. **P2 `polish`**: add restrained rounding and rebalance panel hierarchy.
4. **P3 `colorize`**: make the upper dashboard communicate program status with meaningful data color.

## Post-remediation audit

| Dimension | Score | Verification |
| --- | --- | --- |
| Accessibility | 4/4 | Portfolio selection now uses native buttons; labels, dialogs, tabs, focus indicators, and error feedback remain present. |
| Performance | 4/4 | The route remains static with local fixture data, no external media, and no network calls. |
| Responsive design | 4/4 | Major layouts collapse at tablet and mobile widths; primary controls now meet 44px targets. Intentional table scrolling retains all columns on small screens. |
| Theming | 4/4 | Semantic healthy, attention, decision, and informational colors are applied to metrics, charts, function progress, and dependencies. |
| Anti-patterns | 4/4 | Cadence uses a restrained operational-tool aesthetic: direct copy, a small navigation surface, purposeful radius, denser real-looking program data, and no decorative filler. |
| **Total** | **20/20** | **Excellent: implementation and code-level visual audit passed.** |

### Remediation summary

- Renamed the concept to Cadence and rewrote visible copy to be shorter and less promotional.
- Reduced navigation to Program, Locations, and Inbox; moved the guided scenario into the operating context.
- Replaced interactive table rows with native location buttons.
- Replaced the stale build-status message with a record-specific decision note.
- Added semantic data colors, function readiness data, 6px control-level rounding, and 44px targets.
