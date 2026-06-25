# Portfolio Audit And Stack Plan

Date: 2026-06-25

## Goal

Reposition this portfolio for a fullstack engineer whose strongest signal is frontend craft. The site should be catchy, fast, accessible, and specific without becoming flashy for its own sake.

## Current State

The repo is a small Create React App site with three routes:

- `/` navigation-only welcome screen
- `/about` short bio and skills
- `/portfolio` placeholder text

Relevant files:

- `package.json`: CRA, React 17, React Router 5, styled-components 5
- `src/App.js`: client-side routing for three static pages
- `src/pages/*`: static page content
- `src/styles/*`: global styles, layout primitives, simple theme object
- `CNAME`: custom domain configuration for GitHub Pages

## Stack Recommendation

### Recommendation: migrate to Astro

React is heavier than this site needs. The current portfolio is static content with no stateful app behavior, so shipping a React SPA makes the site more complex than the product requires.

Astro is the best fit if we want a modern frontend portfolio that still feels intentionally engineered:

- Ships zero client JavaScript by default for static pages
- Supports componentized layouts, content collections, Markdown/MDX, and image optimization
- Can keep React only where an interactive island is genuinely useful
- Works well with GitHub Pages and a custom `CNAME`
- Gives enough structure to showcase frontend craft without turning the portfolio into an app shell

### Alternatives

- Plain HTML/CSS/JS: fastest and simplest, but less ergonomic once project pages, reusable components, and content structure grow.
- Eleventy: excellent static-site generator, especially for content-heavy sites, but Astro is friendlier if we later want selective React islands.
- Vite + React: a good modernization if you want to keep React, but still unnecessary unless we add meaningful client-side interactivity.

Decision point for discussion: I would choose Astro unless you specifically want this portfolio to demonstrate React implementation patterns.

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2/4 | External links use `target="blank"` without `rel`, and navigation/content semantics are thin. |
| 2 | Performance | 2/4 | Static content is served through CRA, React Router, and styled-components runtime. |
| 3 | Responsive Design | 2/4 | `height: calc(100vh - 4rem)` and large horizontal margins risk cramped mobile layouts. |
| 4 | Theming | 2/4 | A theme object exists, but tokens are minimal and at least one color is hard-coded. |
| 5 | Anti-Patterns | 3/4 | It avoids modern AI-slop visuals, but the portfolio page is empty and the experience is under-signaled. |
| **Total** | **11/20** | **Acceptable: significant work needed.** |

## Anti-Patterns Verdict

Pass: this does not look like a generic AI-generated portfolio. It is sparse, old-school, and personal rather than glassy, gradient-heavy, or metric-card-driven.

The main issue is the opposite problem: it is too underbuilt for the role signal. A frontend-focused fullstack engineer needs visible craft, project specificity, and responsive polish. The current site reads more like a placeholder splash page than a current portfolio.

## Executive Summary

- Audit Health Score: 11/20, Acceptable
- Issues found: P0: 0, P1: 4, P2: 5, P3: 2
- Highest priority: replace the empty portfolio page with proof-of-work content.
- Highest technical priority: move away from CRA SPA architecture or modernize it.
- Highest design priority: create a memorable but restrained frontend identity with stronger information architecture.

## Detailed Findings

### P1: Portfolio page does not prove work

- Location: `src/pages/PortfolioPage.js:9`
- Category: Anti-Pattern / Content / UX
- Impact: The highest-intent page says "under construction", which weakens credibility for recruiters and engineering leads.
- Standard: Portfolio conversion best practice; no WCAG mapping.
- Recommendation: Replace with 3-5 selected projects. Each should include role, stack, problem, constraints, decisions, result, and links/screenshots where possible.
- Suggested command: `$onboard`

### P1: React SPA stack is oversized for static content

- Location: `package.json:11`, `package.json:13`, `package.json:14`, `package.json:15`; `src/App.js:14`
- Category: Performance / Architecture
- Impact: Users download and execute a JavaScript app for content that could be static HTML. This also keeps the repo on old CRA infrastructure.
- Standard: Web performance best practice; reduce unused JavaScript.
- Recommendation: Migrate to Astro with static routes and optional islands only where interaction matters.
- Suggested command: `$optimize`

### P1: External link handling is incorrect

- Location: `src/pages/AboutPage.js:11`, `src/pages/AboutPage.js:21`, `src/pages/PortfolioPage.js:14`
- Category: Accessibility / Security
- Impact: `target="blank"` creates a named browsing context instead of the conventional `_blank`; links that open a new tab should also use `rel="noreferrer"`.
- WCAG/Standard: WCAG 3.2.5 is relevant if new-window behavior is not communicated; security best practice for `target="_blank"`.
- Recommendation: Use `target="_blank" rel="noreferrer"` and add accessible text only if the new-tab behavior remains.
- Suggested command: `$harden`

### P1: Fixed viewport-height pages can trap or clip content

- Location: `src/styles/Layout.js:20`, `src/styles/Layout.js:33`
- Category: Responsive
- Impact: `height: calc(100vh - 4rem)` can clip text on small screens, browser chrome changes, zoomed text, and landscape mobile.
- WCAG/Standard: WCAG 1.4.10 Reflow, WCAG 1.4.4 Resize Text.
- Recommendation: Use `min-height`, responsive padding, and content-driven layout instead of fixed viewport height.
- Suggested command: `$adapt`

### P2: Navigation structure is too thin

- Location: `src/pages/WelcomePage.js:8`
- Category: Accessibility / UX
- Impact: The first screen is only links plus a small footer. It does not state role, value, current focus, or strongest work.
- Standard: Semantic HTML and information architecture best practice.
- Recommendation: Make the first route a real landing section with a clear heading, short positioning statement, primary project link, and contact action.
- Suggested command: `$clarify`

### P2: Theme tokens are incomplete

- Location: `src/styles/Theme.js:1`, `src/styles/Typography.js:27`
- Category: Theming
- Impact: Theme values are too shallow to support a redesign consistently, and `#000` is hard-coded in `Mark`.
- Standard: Design token consistency.
- Recommendation: Define tokens for background, surface, text, muted text, accent, focus, border, spacing, radius, and motion.
- Suggested command: `$normalize`

### P2: Link focus and hover states are under-specified

- Location: `src/styles/Global.js:90`
- Category: Accessibility / Interaction
- Impact: Links remove underline globally and do not define explicit focus-visible states, making keyboard navigation and link recognition weaker.
- WCAG/Standard: WCAG 2.4.7 Focus Visible, WCAG 1.4.1 Use of Color.
- Recommendation: Restore visible affordances through underline, offset underline, or a clear focus ring that fits the visual system.
- Suggested command: `$harden`

### P2: Mobile spacing is fragile

- Location: `src/styles/Layout.js:21`, `src/styles/Layout.js:34`, `src/styles/Layout.js:53`
- Category: Responsive
- Impact: Large fixed margins and divider sizing can crowd narrow devices and produce awkward composition.
- WCAG/Standard: WCAG 1.4.10 Reflow.
- Recommendation: Replace fixed margins with fluid `clamp()` spacing and constrain content with `max-width`.
- Suggested command: `$adapt`

### P2: Typography has personality but not enough hierarchy

- Location: `src/styles/Theme.js:6`, `src/styles/Global.js:73`
- Category: Anti-Pattern / Responsive / Readability
- Impact: The font choices are distinctive, but the pages rely on similar paragraph sizing and sparse hierarchy, so scanning is hard.
- Standard: Readability and typographic hierarchy best practice.
- Recommendation: Establish a type scale for hero, section heading, body, metadata, and project detail text.
- Suggested command: `$typeset`

### P3: Skills list needs curation

- Location: `src/pages/AboutPage.js:15`
- Category: Content / UX
- Impact: A flat list of technologies does not tell the reader what you are best at or how recently you used each skill.
- Recommendation: Group skills into Frontend, Backend, Data, Tooling, and Current Focus, or tie skills directly to project case studies.
- Suggested command: `$clarify`

### P3: Outdated copy and naming should be cleaned up

- Location: `src/pages/AboutPage.js:13`, `src/pages/AboutPage.js:16`, `src/data.js:2`
- Category: Content / Polish
- Impact: Current-company and skill spelling details can make the site feel stale if they are not current.
- Recommendation: Refresh role/current work and normalize spellings such as GitHub and PostgreSQL.
- Suggested command: `$polish`

## Patterns And Systemic Issues

- The current site is static but implemented as a client-rendered app.
- Layout is centered around full-height pages instead of content-first responsive sections.
- Styling has a simple theme but not a design system.
- The portfolio lacks the artifacts a hiring audience needs: project evidence, screenshots, constraints, outcomes, and links.

## Positive Findings

- The codebase is small and easy to migrate.
- The existing Berkeley blue/gold identity is personal and recognizable.
- The site avoids common AI-portfolio tells: purple gradients, glass cards, fake stats, and generic icon grids.
- Contact links and a custom domain are already in place.

## Proposed Direction

Visual direction: "sharp editorial engineer." Use strong typography, a controlled blue/gold accent, high-contrast light and dark surfaces, precise layout, and subtle motion. The site should feel like a frontend engineer designed it carefully, not like a template.

Information architecture:

1. Home: positioning, current focus, strongest project preview, contact/social links.
2. Work: selected projects with case-study cards and detail pages.
3. About: short story, working style, skills grouped by strength.
4. Contact: direct mail link plus GitHub/LinkedIn.

Content model for each project:

- Project name
- One-line outcome
- Role and ownership
- Stack
- Problem
- Constraints
- Key frontend decisions
- Backend/fullstack decisions, where relevant
- Result or learning
- Links and screenshots

## Recommended Actions

1. **[P1] `$onboard`** - Define the first viewport and project content so visitors immediately understand your frontend/fullstack signal.
2. **[P1] `$optimize`** - Decide on Astro migration and remove the unnecessary React SPA runtime for static content.
3. **[P1] `$adapt`** - Replace fixed viewport-height layouts with resilient responsive sections.
4. **[P1] `$harden`** - Fix link behavior, focus states, semantic landmarks, and reduced-motion/accessibility basics.
5. **[P2] `$typeset`** - Build a clearer typography system for portfolio scanning and project case studies.
6. **[P2] `$normalize`** - Expand theme tokens and remove hard-coded colors before redesign work.
7. **[P2] `$clarify`** - Rewrite positioning, skills, and project copy so it sounds specific and current.
8. **[P3] `$polish`** - Final pass for spacing, naming, metadata, favicons, and GitHub Pages deployment details.

Re-run `$audit` after fixes to see the score improve.

## Discussion Questions

1. Do you want the site to demonstrate React specifically, or is the priority the best portfolio experience with the least runtime?
2. Which 3-5 projects should become the core case studies?
3. Should the visual identity keep Berkeley blue/gold as the main palette, or use it only as an accent?
4. Do you want a single-page portfolio, or separate pages for work/about/contact?
5. Should the design context in `.impeccable.md` also be copied into `AGENTS.md` for future agent sessions?
