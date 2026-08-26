# Product And Demo Rules

## Scope

- Keep the portfolio static and lightweight.
- Treat all demo data as fictional. Do not include client names, client data, source code, or NDA-sensitive implementation details.
- Keep demos browser-only: no backend, API calls, authentication, analytics, AI calls, or token-dependent features.

## Product quality

- Start each demo with a concise scenario brief for first-time visitors. It must offer guided entry and self-directed exploration with equal visual weight.
- Guided steps must point to real controls, wait for the visitor's action, allow dismissal at every step, and be restartable.
- On phones, use a bottom sheet for scenario briefs, dialogs, and guided explanations. Do not rely on hover or desktop-only positioning.
- Prefer one focused user flow over a long page full of simultaneously visible features.
- Keep state local and internally consistent: a change to a task, schedule, or decision must update every relevant visible surface.

## Design

- Use sans-serif typography across the portfolio and demos unless a future page has an explicit, reviewed exception.
- Build mobile-first with touch targets of at least 44px, resilient text wrapping, visible focus states, and reduced-motion support.
- Use a deliberate visual direction for each demo. Avoid generic dashboards, rounded-card nesting, purple gradients, decorative metric walls, and generic AI copy.
- Use semantic HTML and native controls where possible. Dialogs require labels, keyboard escape behavior, and sensible focus handling.
- Keep explanatory copy short and contextual. The interface should demonstrate the product by letting the visitor do the work.

## Verification

- After each functional slice, run `npm run build`.
- Audit mobile and desktop behavior before considering a demo ready to publish.
- Do not deploy demos until explicitly requested. Public deployment must omit `/demo/*` until that decision changes.
