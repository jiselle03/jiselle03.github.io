# Design systems

This portfolio deliberately uses one parent system and two distinct demo systems. They share accessibility and interaction standards, not visual tokens. A demo should feel like a product with its own audience and point of view, never like a recolored portfolio page.

## Shared foundations

- Sans-serif typography only. Use the local Avenir/Helvetica/system stack; do not add remote font requests for these static demos.
- Minimum 44px primary touch targets, visible keyboard focus, semantic native controls, and reduced-motion fallbacks.
- Use color to communicate hierarchy or state. Text, labels, icons, and structure must carry meaning without relying on color alone. Signal colors are fields, marks, and outlines by default; only `--ink`, `--muted`, `--on-*`, and a documented dark signal variant may carry normal-size text.
- Use an 8px-based spacing rhythm. Prefer one clear primary action to a cluster of equal-weight controls.
- Keep all content and state fictional and browser-only.

## Portfolio — Product Casebook

**Job:** establish Jiselle as a precise, product-minded fullstack engineer.

**Character:** an editorial casebook for product work: indexed, evidence-led, and composed around one active case at a time. Its memorable element is a fold-out system map that proves how ambiguous work becomes software. This is not a faux desktop, filing cabinet, or detective prop—the casebook is a clear information hierarchy.

| Role | Token direction |
| --- | --- |
| Surface | warm technical paper |
| Ink | deep blue-black |
| Signal | sharp yellow for primary action and emphasis |
| Supporting signals | cobalt for systems, mint for delivery |
| Structure | a narrow project index, one active case surface, marginal context notes, and an open-work strip |

| Existing content | Casebook object |
| --- | --- |
| Introduction and positioning | Cover brief: who Jiselle is, what she builds, and the current question she solves |
| Selected work | Numbered case files with role, constraint, decision, and outcome |
| Process map | Fold-out system map: observe → diagnose → propose → scope → code → test → document |
| Working style and method | Margin notes: principles and collaboration style, adjacent to the relevant evidence |
| Writing | Field notes / open notes, kept secondary to selected work |
| Demos | Working prototypes, clearly marked as fictional browser-only artifacts |

The first desktop viewport must visibly say “Jiselle Liu — product engineer,” “Selected work,” and “How I work.” Use grids, diagrams, numbered sections, and clear editorial hierarchy. Avoid soft glass surfaces, rounded-card stacks, decorative metrics, oversized visual effects, fake title bars, close buttons, or desktop icons.

## Set — Studio Night / Dayboard

**Reference:** a purpose-built calendar/timetable system. Set is presented as a scheduling artifact, not as a portfolio-framed dashboard.

**Job:** demonstrate a complex booking product through legible member and partner workflows.

**Character:** a clean, image-free mobile booking surface with bright neutral rows, compact credit summaries, rounded sheets, and an optional dark treatment. Members discover and book classes; partners manage rosters, capacity, schedules, and staff roles; Set staff manage the platform directory and audited support actions. Set is a standalone product surface; portfolio/demo controls are explicitly external presentation chrome.

The external demo controls use the portfolio’s square navy/cream/yellow chrome intentionally, so they read as presentation tooling rather than Set UI. They can be minimized with the close icon or by clicking outside the panel. Set’s own UI never uses that control styling.

Presentation chrome uses its own `--presentation-ink`, `--presentation-paper`, and `--presentation-signal` tokens. Keep those tokens separate from Set’s product tokens so the demo controls can be recognized as tooling rather than a second product surface.

Scenario briefs and the “How it scales” drawer use the same portfolio chrome. Guided product tours are part of Set and use Set styling because they point at live product controls; they are not portfolio presentation chrome. These surfaces are mutually exclusive: opening the demo controls or product-plan drawer closes any active tour, and starting a tour closes the controls panel. All dialogs and tours expose a consistent top-right close control.

| Role | Screenshot-derived direction |
| --- | --- |
| Surface | deep night field by default; optional warm light mode |
| Ink | ice-white type with low-contrast hairline rules |
| Primary action | cyan action block; pink signals change or attention |
| Secondary accent | lime for available/confirmed status |
| Highlight | night-3 surface for selected appointment details |
| Confirmed / available | explicit text plus a color block; never color alone |
| Member object | a scheduled class record with time, studio, instructor, duration, credits, access notes, and a readiness checklist |
| Partner object | a class roster with enrolled members, attendance/check-in state, capacity, waitlist, direct management actions, and a staff/role permissions page |
| Admin object | a platform member directory with account status, credits, bookings, activity, audited support actions, and Set-platform staff/role permissions |
| Structure | strong vertical rails, dense schedule rows, register-like dividers, and one large current decision |

Member desktop composition: a scheduled class at left, the day’s choice or booked plan in the center, and a personal credit/readiness record at right. Partner desktop composition: a current class roster at left and schedule/change board at center, with a staff-and-roles register available from partner navigation; do not expose partner-only studio information in the member workspace. Admin desktop composition: an account directory at left, a selected member record at center, and an immutable-looking action/activity history at right, with a separate platform-roles register. On phone, make the scheduled class or selected member record the first card, then show one schedule, roster, account, or permissions panel at a time.

The demo shell may switch between Member, Partner, and Admin to demonstrate roles. Inside the product, each role only sees its own navigation and data scope. A Partner Admin can define and assign Form House’s staff roles (for example Admin, Trainer, or Front Desk) and their view/edit permissions; those roles never cross into another partner. Set uses two platform roles in the demo: Admin and Operator. Admin has directory, role, and support control; Operator has scoped read and support access. Admin support actions are fictional and local, but should visibly update the affected member account, schedule, credit balance, or roster and add a timestamped activity entry.

Keep language literal: class, studio, roster, capacity, credits, attendance, staff role, and audit history. Do not add travel, notebook, paper-texture, or arcade terminology to Set. Do not turn the partner console into a metric-card dashboard.

## Small Walks — Quest Arcade

**Reference:** the user-supplied “Trailhead Stack” screenshot. This is a visual reference distilled from the image, not a linked or externally inspected design system.

**Job:** turn a short nearby walk into a small, browsable stack of observations.

**Character:** a playful quest arcade for nearby walks. A route is a quest, each observation is a level objective, and a completed outing earns a saved “run” card. The experience should feel game-like and energetic without becoming a generic neon dashboard.

| Role | Screenshot-derived direction |
| --- | --- |
| Surface | dark arcade workbench with cream quest cards and bright score accents |
| Ink | near-black/navy rules and type; never purple gradients |
| State | active quest uses a solid accent block with an explicit label; completion uses a stamp or score mark |
| Illustration | chunky map marks, route arrows, stamps, and user-captured images framed like game cards |
| Type | compact sans-serif hierarchy with a pixel/display accent reserved for quest titles and score labels |
| Structure | quest select rail, one dominant current objective, progress/score rail, and a completion ticket |

Desktop should use a three-zone composition: quest select at left, the current objective in the center, and a score/progress rail at right. The rail holds tokens/stamps, the current prompt, and the most recent completed run—not generic “today / next up” widgets. On phones, collapse this into one quest card at a time with a visible level index and a bottom-sheet capture flow. Use color for score and completion only, with text labels for every state. Do not imitate the screenshot’s product name, artwork, or content; use only its compositional grammar.

Hand Drawn Zine Explainer is no longer a page-level direction. Taller Gráfica Linocut remains reserved for a future editorial/writing page.

## Implementation tokens and rules

These are the source of truth for new work. Values may be implemented as CSS custom properties, but their semantic names and usage must remain intact. A color or size without a named role is not a new token.

### Shared foundations

| Category | Token | Value | Use |
| --- | --- | --- | --- |
| Typeface | `--font-sans` | `"Avenir Next", Avenir, "Helvetica Neue", ui-sans-serif, system-ui, sans-serif` | All portfolio and demo UI. No remote font loading. |
| Type | `--text-xs` / `--text-sm` / `--text-md` | 12px / 14px / 16px | Labels, supporting UI, body copy. |
| Type | `--text-lg` / `--text-xl` | 20px / 28px | Card titles and section headings. |
| Type | `--text-2xl` / `--text-display` | 40px / `clamp(48px, 7vw, 104px)` | Page and demo focal headings only. |
| Type | `--lh-tight` / `--lh-body` | 0.96–1.08 / 1.45–1.6 | Headings / readable paragraphs. |
| Weight | `--weight-label` / `--weight-strong` | 750 / 850–900 | Labels and headings; avoid medium-weight ambiguity. |
| Space | `--space-1`…`--space-8` | 4, 8, 12, 16, 24, 32, 48, 64px | Use this scale for gap, padding, and section rhythm. |
| Geometry | `--tap-target` | 44px minimum | Every standalone control, including icon controls. |
| Focus | `--focus-ring` | 3px solid semantic accent, 3px offset | Keyboard-only focus; never remove it. |
| Motion | `--ease-out` / `--duration-ui` | `cubic-bezier(.22,1,.36,1)` / 180ms | State feedback only. Disable under reduced motion. |
| Performance | `--asset-budget` | One local image under 1.5 MB per saved object; no remote media | Compress before shipping; reserve layout space; do not animate layout continuously. |

Do not introduce gradients, decorative metrics, pill-shaped chips, or more than one shadow treatment per system. Dialogs are centered on desktop and bottom sheets on phones.

### Portfolio — Product Casebook

| Role | Token | Value | Rules |
| --- | --- | --- | --- |
| Canvas | `--portfolio-paper` | `#f3f0e8` | Default page field. |
| Ink | `--portfolio-ink` | `#14243a` | Type, critical rules, active controls. |
| Muted | `--portfolio-muted` | `#596b80` | Secondary copy only; never primary actions. |
| Rule | `--portfolio-line` | `#b9c4cf` | Quiet dividers and diagram grid. |
| Primary signal | `--portfolio-yellow` | `#f0cf27` | One primary action or key decision per viewport. |
| System signal | `--portfolio-blue` | `#315fc9` | Technical/system stages in the process map. |
| Delivery signal | `--portfolio-mint` | `#6cae92` | Verified/delivered fields, marks, or diagram nodes only; never normal-size text on paper. |
| Planning wash | `--portfolio-planning` | `#dce6fb` | Diagram groups, not generic cards. |
| Delivery wash | `--portfolio-delivery` | `#dbece2` | Diagram groups, not generic cards. |

Portfolio layouts use a 1180px maximum content width and three desktop zones: a 20% project index, a 55–60% active case surface, and a 20–25% context rail. The project index is navigation, not decoration; the context rail contains availability, methods, or short evidence notes. Below the active case, use an open-work strip for selected work and writing. The recurring artifact grammar is: index tab, cover brief, evidence note, fold-out system map, numbered case file, and open-work strip. On phones, the index becomes a compact section switcher and the active case remains first.

Use left-aligned editorial headings, 1–2px ink rules, and square corners. Offset shadows are `3–6px` hard ink shadows and occur only on an identity mark, primary action, or a decisive diagram node. Page headings use `--text-display`; section headings use `--text-2xl`; body copy stays at 16px with a maximum measure of 65–75 characters. The visual signature comes from the index/case/map relationship, not decorative window chrome.

### Set — Calendar Register

| Role | Token | Value | Rules |
| --- | --- | --- | --- |
| Shell paper | `--set-shell-paper` | `#f3f0e8` | Shared portfolio demo shell only. |
| Night field | `--night` | `#11131b` | Dark-mode app canvas. |
| Surface | `--night-2` | `#191c28` | Dark appointment, roster, and form surfaces. |
| Selected surface | `--night-3` | `#23283a` | Dark selected rows and expanded records. |
| Ice text | `--ice` | `#f3f7ff` | Primary text on dark mode. |
| Cyan | `--cyan` | `#39a9b7` | Primary action, focus, and active day. |
| Pink | `--pink` | `#d77a9d` | Attention, date stamp, and change state. |
| Lime | `--lime` | `#c8e47b` | Available/confirmed status and credit balance. |
| Light mode | `[data-theme="light"]` | `#eef1f3` canvas / `#fff` cards | Default mobile-friendly treatment; dark mode remains available from settings. |

Set’s desktop grid is class catalog / selected class and readiness details / credit or schedule context. On phones, the member Explore view follows a marketplace pattern: greeting and credit summary, next booking, activity categories, then browseable class rows. No fake photography or gradient “image” placeholders are used; the product’s proof is the booking flow and its synchronized state. The member class record contains a class name, date/time, studio, instructor, duration, credit cost, arrival/access notes, and a static readiness list. Schedule includes a compact seven-day calendar followed by the booking state. The partner view uses a class roster with enrolled members, capacity, waitlist, attendance, and change history. Its Staff & roles register lists named accounts, roles, scope, and view/edit grants. The Set Admin home is a platform overview with fictional 30/90-day trend stats; Members, Partners, and Roles are separate admin navigation destinations. Directories support local enable/disable controls, selected-record support actions, and an activity history. Use clean rows, strong color blocks, and one decisive action per surface; do not decorate every panel as a ticket.

Set type scale: metadata 11–12px, controls 13–14px, roster-row titles 15–16px, panel headings 24–28px, focal heading `clamp(38px, 5vw, 74px)`. Display and body copy use a neutral, readable Helvetica/system sans; no condensed or novelty display face. Labels are uppercase with 0.08em tracking; body copy stays sentence case. Main headings are short and self-explanatory; avoid repeated “member” labels, duplicate credit summaries, and explanatory subhead paragraphs. Primary actions are cyan blocks with at least 44px height. On phones, the date picker becomes a compact day selector, class records stack into one timetable, and selected details open below the list.

Timetable rows use a compact time rail and hairline separators; time is not placed inside a large bordered tile. Date and credit summaries stay short and aligned to the heading baseline. The final rhythm uses a small spacing scale (`.35/.6/.9/1.25/1.75/2.5rem`) and avoids decorative nested cards. A selected roster record gets only a brief 220ms lift and focus outline; reduced-motion users receive no animation. Context drawers close on backdrop click, and presentation overlays never compete with the guided tour.

### Current product-shell decision

Desktop product chrome is a single continuous row: Set mark at left, role navigation in the middle, and the signed-in account context at right. The light theme uses the same cool canvas behind the row; only the active navigation item is filled. The demo controls remain separate presentation tooling and are not part of the Set surface. The account page is the only location for the light/dark preference.

### Small Walks — Quest Arcade

| Role | Token | Value | Rules |
| --- | --- | --- | --- |
| Workbench | `--walk-bench` | `#171a2b` | Outer arcade field. |
| Quest paper | `--walk-paper` | `#fff8e8` | Quest cards and capture sheets. |
| Ink | `--walk-ink` | `#171a2b` | Type, rules, and active state. |
| Token blue | `--walk-token` | `#2f66de` | Progress and primary action. |
| Score coral | `--walk-score` | `#ef5b46` | Completion, score, and earned stamp fields. |
| Quest lime | `--walk-quest` | `#d8f04b` | Current objective marker only; never body text. |
| Active text | `--walk-on-active` | `#fff8e8` | Text on active fill. |
| Warning | `--walk-warning` | `#ef5b46` | Validation or destructive field/border only; use ink error copy on a warning wash. |

Small Walks uses a dark field with cream quest cards and three semantic accents. Desktop uses a 20–24% quest rail, a 52–56% current objective, and a 20–24% score rail. Supporting panels are separated by rules rather than generic dashboard cards. The score rail contains progress stamps, active prompt, and last completed run. Quest rows have an ordinal, title, and state; the active row is lime with dark type. The current objective is the only place for a large heading. Use route arrows, stamps, and the visitor’s own photo as the artwork; do not add decorative texture behind readable content.

Small Walks type scale: stack labels 12px, controls 13–14px, card headings 20–28px, focal heading `clamp(40px, 6vw, 76px)`. Use 0.06–0.1em tracking for utility labels and normal tracking for prose. Corners are 0–4px; frame treatment is a 1–2px rule, never a soft shadow. On phones, the contents rail becomes a compact stack index and the capture UI remains a bottom sheet.

## Review checklist

Before changing a surface, ask:

1. Does this reinforce its system’s job and memorable proof point?
2. Is the hierarchy still understandable without color or motion?
3. Does it work at 320px, keyboard-only, and with reduced motion?
4. Is the detail functional or is it merely decoration?
