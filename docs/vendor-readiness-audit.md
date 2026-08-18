# Vendor Readiness Audit

Date: 2026-08-18

## Baseline Health Score

| Dimension | Score | Key finding |
| --- | --- | --- |
| Accessibility | 3/4 | Semantic regions, labels, and dialog exist; current navigation state and small controls need refinement. |
| Performance | 4/4 | Static output, no external media, and small browser-only state. |
| Theming | 1/4 | Legacy hard-coded colors remain beneath a second override layer. |
| Responsive design | 3/4 | Grid breakpoints exist; several compact controls miss 44px touch targets. |
| Anti-patterns | 2/4 | Dashboard content is credible, but the legacy/override style split makes the visual system feel assembled rather than intentional. |
| **Total** | **13/20** | **Acceptable: significant design-system work needed.** |

## Findings

### P1: Two competing visual systems

- **Location:** `src/styles/vendor-readiness.css`
- **Category:** Theming / Anti-pattern
- **Impact:** Green legacy styles and blue overrides coexist. This makes a professional, predictable dashboard difficult to maintain and weakens visual coherence.
- **Recommendation:** Replace the stylesheet with one tokenized corporate palette, rather than overriding the original rules.

### P1: Compact controls miss touch-target guidance

- **Location:** `src/styles/vendor-readiness.css` list filters, evidence actions, help button
- **Category:** Responsive / Accessibility
- **Impact:** Controls below 44px are less reliable on touch devices.
- **Standard:** WCAG 2.5.8 Target Size (Minimum).
- **Recommendation:** Set interactive controls to at least 44px square or provide equivalent spacing.

### P2: Current navigation state is visual only

- **Location:** `src/pages/demo/vendor-readiness.astro` app navigation
- **Category:** Accessibility
- **Impact:** Assistive technology does not receive the selected navigation state.
- **Recommendation:** Add `aria-current="page"` to the active item.

### P2: Guided-tour state lacks an explicit focus target

- **Location:** `src/pages/demo/vendor-readiness.astro` tour script
- **Category:** Accessibility
- **Impact:** After beginning the tour, the page scrolls to the portfolio but keyboard focus remains on the closed dialog trigger.
- **Recommendation:** Move focus to the at-risk vendor filter after closing the dialog.

### P2: Dashboard hierarchy is too regular

- **Location:** Dashboard metric and workspace panel layout
- **Category:** Anti-pattern
- **Impact:** Equal-weight panels flatten the operational story.
- **Recommendation:** Use a stronger decision-first layout, larger portfolio signal, and a denser active-work table.

## Positive Findings

- The route is static, self-contained, and has no client data or AI dependency.
- Interaction state is rendered with safe DOM APIs rather than interpolated user strings.
- Inputs have visible labels and the demo has a skip link.
- The dashboard has narrow-screen breakpoints and no image or external-font performance cost.

## Post-Remediation Audit

| Dimension | Score | Verification |
| --- | --- | --- |
| Accessibility | 4/4 | Labeled controls, semantic regions, skip link, explicit focus styling, `aria-current`, and `aria-pressed` states are present. The tour moves keyboard focus to the active filter. |
| Performance | 4/4 | Static Astro output, no external assets, no layout reads in render loops, and small in-memory state only. |
| Theming | 4/4 | One scoped tokenized corporate palette and a single sans-serif type system replace the previous legacy/override split. |
| Responsive design | 4/4 | Fluid grid tracks collapse at tablet/mobile widths; primary controls use 44px minimum targets. |
| Anti-patterns | 4/4 | The dashboard is a specific operational product with a decision-first hierarchy, not a generic portfolio card grid. |
| **Total** | **20/20** | **Excellent: code-level audit passed.** |

### Residual Verification

The score covers the implementation and generated static output. A manual rendered-browser pass remains useful for subjective visual review at 375px, 768px, and desktop widths after any future content change.

## Screenshot Validation: Desktop Reflow

The supplied 1270px screenshot found a real P1 reflow defect after the code-level audit: the vendor-list heading and filter controls competed for horizontal space, making the control group appear to intrude into the adjacent vendor detail panel.

### Remediation

- The three-column workspace now becomes two columns below 1420px, with the decision log placed below the working area.
- The vendor-list header stacks the filters above the list at that breakpoint, and each filter shares the available width.
- A scenario strip now explains the operational problem: opening five locations requires procurement, finance, and operations to approve vendors from one evidence record.

## Next Product Features

Add features only when they advance the vendor-readiness story:

1. **Role inbox:** give procurement, finance, and operations separate actionable queues, making role-based access concrete.
2. **Evidence request loop:** allow a reviewer to request a missing document, set a due date, and show the vendor return to the queue.
3. **Activation decision sheet:** show a short approval summary with blockers, accountable owner, and audit record before final activation.
4. **Renewal timeline:** add expiring documents and renewal dates to show the system supports ongoing operations, not just onboarding.
