# Small Walks design audit

Date: 2026-08-19

## Audit health score

| Dimension | Score | Key finding |
| --- | --- | --- |
| Accessibility | 3/4 | Labels, focus styling, and form validation exist; the photo control needs clearer selected-file feedback and the print flow opens an unannounced window. |
| Performance | 3/4 | The route is static and light, but storing full image data URLs in local storage can exhaust browser quota. |
| Responsive design | 2/4 | It collapses to one column, but it was composed as a desktop form and card grid rather than a one-handed phone flow. |
| Theming | 2/4 | Tokens exist, but visual hierarchy depends on flat panels and simple color swaps rather than a coherent visual system. |
| Anti-patterns | 1/4 | The result reads as a generic journaling form followed by a portfolio-card grid. The prompt does not drive the interface or give the visitor anything memorable to do. |
| **Total** | **11/20** | **Acceptable: replace the interaction and visual direction.** |

## Anti-patterns verdict

**Fail.** The current build is competent but obviously assembled: intro, prompt card, form, sidebar note, and repeated entry cards. It has too much explanatory copy and no visual payoff until after a user completes a conventional form. The soft green palette and serif-plus-sans pairing are pleasant but do not make the product distinctive.

## P1 findings

### Desktop-first information order

- **Location:** `src/pages/demo/small-walks.astro`, intro, builder, entry layout, walkbook order
- **Impact:** On a phone, the most important action, adding a find, is below introductory copy and multiple choices. The app does not feel usable while standing outside with one hand.
- **Recommendation:** Start directly in an active walk. Put the prompt, camera/photo control, found-item state, and finish action in the first viewport. Move the journal below the current outing.

### Generic form-to-card interaction

- **Location:** `src/pages/demo/small-walks.astro`, entry form and walkbook renderer
- **Impact:** A visitor sees a familiar journal form, not an activity. It does not make a compelling demo of product or interaction design.
- **Recommendation:** Replace the single entry form with a three-find “field card” flow. Each found item has a prompt-specific slot, photo or visual placeholder, a short note, and a visible completion state.

### Photo persistence has no real size boundary

- **Location:** `src/pages/demo/small-walks.astro`, `FileReader` and local-storage save path
- **Impact:** Modern phone photos can overflow browser storage. The app reports failure only after reading and assembling the entry.
- **Recommendation:** Validate file size before reading, state a local image limit, and keep the preview local to the current session when it exceeds the stored limit.

## P2 findings

### Visual language is too passive

- **Location:** `src/styles/small-walks.css`
- **Impact:** Plain borders, muted blocks, and repeated cards do not make the app feel like a field journal or a small game.
- **Recommendation:** Use a tactile field-notes direction: a dark ink ground, high-contrast paper cards, a route stamp, bold numbered find slots, and strong imagery. Keep the page dense on mobile, not decorative.

### No meaningful “finish” moment

- **Location:** `src/pages/demo/small-walks.astro`, save and print interactions
- **Impact:** Saving a single entry adds another card without giving a visitor a payoff or reason to continue.
- **Recommendation:** Complete a walk after three finds. Generate a share card with the outing title, route stamp, three photos/placeholders, and the user’s notes.

### Touch workflow is incomplete

- **Location:** `src/styles/small-walks.css`, mobile breakpoint
- **Impact:** Controls technically stack, but the interaction does not prioritize thumb reach, scanability, or the camera/photo action.
- **Recommendation:** Make the primary capture control fixed at the bottom of the active-walk viewport and use 48px minimum target sizes.

## Replacement direction

Build **Small Walks as a pocket field-notes game**, not a journal.

### First viewport on mobile

- Header: `Small Walks`, a small local-only indicator, and a walkbook icon button.
- Current outing: a location-agnostic title such as “Side Street” plus a 20-minute timer-style chip.
- Three numbered find cards: one active prompt, two locked future prompts.
- A full-width `Add a find` control. It opens a focused capture sheet with photo, note, and “save find.”

### Core loop

1. Start a 10, 20, or 40 minute outing.
2. Find three prompt-specific details.
3. Add local photos or choose a visual marker if a photo is not wanted.
4. Finish the outing and view a collage-style field card.
5. Save the card in the local walkbook or print it.

### Desktop adaptation

The desktop view becomes a wider field board: current outing on the left, finished field card on the right, walkbook below. It should not introduce a separate desktop-only workflow.

### Product complexity worth showing

- Stateful three-step outing flow.
- Photo validation, local previews, and placeholder choices.
- Progress and locked/unlocked prompt states.
- Local persistence and reset.
- Generated collage share cards.
- Mobile capture sheet and desktop board from the same state model.

## Recommended actions

1. **P1 `$distill`**: remove the current intro, sidebar note, and generic form/card hierarchy.
2. **P1 `$adapt`**: rebuild around the active outing as the mobile-first first viewport.
3. **P2 `$bolder`**: apply the field-notes visual system and a stronger completion moment.
4. **P2 `$harden`**: add local-image size handling and clearer preview feedback.
5. **P2 `$polish`**: verify touch targets, print card, focus order, and reduced-motion behavior.

## Field-notes rebuild audit

| Dimension | Score | Verification |
| --- | --- | --- |
| Accessibility | 4/4 | Native controls, visible focus, labeled capture sheet, labeled visual markers, inline validation, and modal focus behavior are present. |
| Performance | 4/4 | Static output and browser-only state; images above 1.5 MB are kept for the active outing but excluded from persistence. |
| Responsive design | 4/4 | The active outing is the first mobile viewport; capture uses a bottom sheet, primary controls are at least 44px, and desktop expands the same state model into a field board. |
| Theming | 4/4 | A cohesive field-notes palette, semantic find states, and reusable token values give prompts, progress, capture, and completion a shared visual language. |
| Anti-patterns | 4/4 | The generic journal form and card grid are gone. The product has one distinct mobile-first activity loop with a visible completion payoff. |
| **Total** | **20/20** | **The interaction model passed, but its visual direction still needs a separate review.** |

## Visual direction follow-up

The first rebuild still borrowed too much from an editorial field journal: serif headings, cream paper, muted green, and low-contrast cards. That made the product feel like a template rather than a memorable demo.

### Remediation

- Replace the serif and paper palette with a strict sans-serif system, midnight ink, vivid blue, coral, lime, and sun-yellow accents.
- Reduce the top bar to product identity and a single return action.
- Turn progress into collectible stamps with an earned state and a short completion animation.
- Treat the active prompt as the visual anchor, with locked and completed cards clearly differentiated.
- Preserve a mobile-first, thumb-reachable capture action and make the desktop version a wider expression of the same board.

### Design re-audit

| Dimension | Score | Verification |
| --- | --- | --- |
| Visual hierarchy | 4/4 | The challenge, progress, and active prompt are the first read; secondary controls no longer compete in the header. |
| Typography | 4/4 | All product UI uses a compact sans-serif hierarchy with no decorative serif treatment. |
| Color and personality | 4/4 | The high-contrast game palette has functional states: blue action, lime collection, coral progress, sun imagery, and midnight structure. |
| Gamification runway | 4/4 | Stamps, blocks, locked prompts, saved cards, and the completion board establish expandable mechanics without pretending there is a backend. |
| Responsive polish | 4/4 | The board is dense and usable at phone widths, then gains space rather than a new workflow at desktop widths. |
| **Total** | **20/20** | **The interface now has a distinct game-like product direction that can support future collections, themed blocks, and sharing.** |
