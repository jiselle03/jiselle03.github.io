# Set demo audit — October 2026

## Health score

| Area | Score | Finding |
| --- | ---: | --- |
| Accessibility | 4/4 | Semantic controls, live regions, focus restoration, Escape dismissal, visible focus styles, and mobile sheets are covered in code. |
| Performance | 4/4 | Static browser-only page with local state and no network work. |
| Theming | 3/4 | Shared tokens are used, with a small amount of presentation-layer color override CSS. |
| Responsive design | 4/4 | Mobile layouts, 44px controls, resilient wrapping, reduced-motion support, and bounded activity content are covered in code. |
| Anti-patterns | 4/4 | The product has a clear editorial/utilitarian direction; duplicate onboarding and stretched activity surfaces are removed from the active flow. |
| **Total** | **19/20** | Strong code-level release candidate; the remaining point is reserved for manual browser verification. |

## Decisions made

- Each role now has one entry point: the guided scenario sheet. “Explore on my own” is the escape hatch; the separate partner/admin brief is retained as dormant copy for future content extraction, not shown on entry.
- Account details live behind the signed-in identity control. The workspace no longer repeats the member name or uses a decorative ID-card block.
- Recent activity is content-sized and scroll-limited rather than stretching to match the roster column.
- The demo remains fictional, browser-only, and resettable. No production authentication, billing, API, analytics, or contact automation belongs in this demo.

## Remaining gaps

- Manual browser verification remains intentionally unscored: test desktop/mobile rendering and assistive-technology announcements in a real browser before publishing.
- Consider extracting the dormant brief copy into a reusable scenario configuration so there is only one source of truth for role onboarding text.
- Keep an eye on long staff/permission tables at 200% text zoom; their horizontal scroll is intentional but should remain clearly discoverable.

## Code-level findings

- **[P2] Dormant brief markup** — `src/pages/demo/studio.astro` still contains the old member, partner, and admin brief dialogs for fallback copy and existing close handlers. They are not opened by the active role entry flow, but extracting their copy into configuration would reduce dead UI surface.
- **[P2] Manual rendering check** — CSS covers mobile breakpoints, touch targets, wrapping, and reduced motion, but viewport screenshots and screen-reader announcements still require a real browser pass. This is deliberately not included in the score.
- **[P3] Dependency audit** — the local npm install reported development-tree advisories; production dependencies are static Astro output. Re-run `npm audit` when registry access is available and review only advisories affecting the build toolchain.

## Positive findings

- All active guides point to real controls and now dismiss via the same Escape path.
- Dialog close handlers restore focus to the trigger, while view changes focus the new page heading.
- Activity, schedule, and account surfaces use bounded content and 44px controls rather than relying on hover or fixed desktop-only positioning.
- Primary actions use cyan, secondary actions use neutral surfaces, and destructive/attention states use pink; adjacent admin actions now have explicit spacing.
- UI copy stays task-led and specific to the role; fictional/demo disclaimers are retained only where they prevent a mistaken production expectation.

## Verification

- `npm run test:unit` — passes: 4 frontend contract tests and zero Astro diagnostics.
- `git diff --check` — passes.
- Local route — `http://localhost:3000/demo/studio/`.
