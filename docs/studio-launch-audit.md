# Set demo launch audit

Date: 2026-10-04  
Scope: static/code audit of `/demo/studio/`, its bundled CSS/JS, and the local build. Browser rendering and assistive-technology checks are listed separately below.

## Audit score

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Accessibility | 4/4 | Native labeled controls, dialog labels and close controls, return-focus handling, live status region, reduced-motion rules, stable theme-toggle pressed semantics, and corrected selected-day semantics. Theme text pair contrast checked at 4.76:1 or better for muted/accent body labels (light theme) and 5.41:1 or better for the pink accent. |
| Performance | 4/4 | Static, dependency-light page with no images, external assets, API requests, or continuous/layout animations. Built HTML/CSS/JS are about 143 KB total before compression. |
| Responsive design | 4/4 | Mobile/tablet/desktop breakpoints; phone sheets; single-column layouts; partner permissions switch to stacked rows rather than overflow; dock and directory controls meet 44px minimum targets. |
| Theming | 4/4 | Dark/light semantic product tokens, explicit color-scheme values, contrast-adjusted light accents, and a separately tokenized demo/presentation surface. |
| Anti-patterns | 4/4 | Active page uses an intentional roster/workspace visual language; no fake photography, active decorative gradients, stacked metric wall, or generic AI copy. |
| **Total** | **20/20** | **Excellent by the code-audit rubric.** |

## Changes in this pass

- Darkened the light-theme cyan/pink tokens after finding small-text contrast below 4.5:1.
- Made the theme control a stable-label toggle whose pressed state means dark theme is active.
- Removed `aria-current="date"` from a selected future day; `aria-pressed` already reports selection.
- Removed narrow-screen horizontal overflow from partner roles and raised the demo dock close target to 44px.
- Tokenized the presentation-layer colors for the dock and scenario briefs.
- Routed account access through the top-right identity control, with distinct member, Partner, and Admin account details; removed the Account workspace tab.
- Removed the duplicate text close action from the product-plan drawer and left its unbordered × control.
- Enforced `[hidden]` globally so CSS grid layouts cannot reveal inactive role/account panels.
- Opportunity-discovery planning was started separately at `~/WebDev/opp-discover`; no crawler or outreach system was added to Set.

## Verification and limits

- `npm run build`: passed; Astro reports 0 errors, warnings, or hints.
- `git diff --check`: passed.
- `http://127.0.0.1:3000/demo/studio/`: returned HTTP 200.
- A local Chrome inspection was approved, but the CDP session timed out at `Runtime.enable`; the browser's debugging-approval gate is still preventing rendered viewport, keyboard-flow, and assistive-technology verification. Do not treat this code score as WCAG certification or real-device sign-off. Re-run those checks when Chrome debugging is available.

## Publish boundary

This is a ready-for-review frontend demo, not a production service. Keep `/demo/*` excluded from public deployment until explicitly approved. Before publishing, verify the rendered page at 320px, 390px, tablet, and desktop widths, then keyboard-test each role brief, booking dialog, partner role flow, and admin support case.
