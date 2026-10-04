# Fitness Booking Demo

## Concept

A fictional membership network that lets people use credits across independent fitness studios. It is centered on a simple visitor question: "What can I book this week with the credits I have?"

The catalog includes reformer, Lagree, kickboxing, bouldering, and strength training. Those formats have different credit costs and booking rules, which makes the product easy to understand while still demonstrating real product complexity.

## First-run scenario

The visitor is a member with 6 credits and a free Thursday evening.

1. Find an available 1:1 bouldering session that costs 4 credits.
2. Book it and see the schedule, capacity, and credit balance update.
3. Open the cancellation policy, cancel within the eligible window, and receive the 4 credits back.
4. Book a 2-credit group session instead.

The scenario brief offers `Start guided scenario` and `Explore on my own`. The guided path points at real controls, waits for each action, is dismissible, and becomes a bottom sheet on phones.

## Views

- **Member workspace:** Explore and My schedule are grouped together under the client-facing view.
- **Explore:** browse the selected day and filter by discipline, format, and studio.
- **Class details:** schedule, instructor, capacity, requirements, credit cost, and cancellation rule.
- **Schedule:** upcoming bookings, waitlist state, credit balance, and cancellation/refund result.
- **Account:** editable profile details, membership information, payment-method display, and a password-change flow.
- **Partner console:** a separate operator surface for partner locations, showing the weekly roster, capacity, and recent member changes.

## Frontend-only boundary

- All classes, members, balances, policies, availability, and account details are local fixtures.
- Booking, cancellation, waitlist, refund, and studio changes are derived browser state that resets on refresh.
- No real payment processing, accounts, maps, API calls, database, AI calls, analytics, or client data.
- A refund means a visible credit-balance state change only; it never represents a real transaction.

## Production reference

The demo stays browser-only, but its interaction model is backed by a public-safe production design:

- [Architecture](./studio-production-architecture.md): tenancy, roles, templates versus occurrences, booking commands, projections, operations, and test layers.
- [Data model](./studio-data-model.md): records, constraints, ledger, recurrence, enrollment, waitlist, and audit boundaries.
- [Behavior rules](./studio-behavior-spec.md): high-risk booking, cancellation, waitlist, conflict, and mobile scenarios.
- [Product delivery plan](./studio-product-delivery-plan.md): discovery questions, rule setting, stakeholder review, and implementation slices.

## Delivery order

1. Create the responsive Explore and My schedule shell with local fixtures.
2. Implement booking and credit/capacity state updates.
3. Add cancellation/refund and waitlist rules.
4. Add the guided scenario and compact studio view.
5. Audit mobile, keyboard, reduced-motion, and state consistency before publishing.
