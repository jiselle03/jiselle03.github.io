# Set Product Delivery Plan

## What I would clarify before implementation

The first deliverable is not a UI. It is a short decision set that prevents a booking product from accumulating contradictory rules after screens have been built.

| Question | Why it matters | Example decision |
| --- | --- | --- |
| Who uses the product? | One screen can mean different things to a member, instructor, manager, or support operator. | A studio manager manages capacity, but cannot alter a member's credit history. |
| What is actually being sold? | It determines pricing, recurrence, refunds, and reporting. | A group class and a 1:1 session share scheduling concepts but have different capacity and cancellation rules. |
| When is a booking final? | Avoids accidental charges, duplicate seats, and confusing pending states. | The final confirmation is the only point that spends credits. |
| What changes after publication? | One-off changes must not corrupt a recurring series. | Moving next Tuesday changes one occurrence, not the weekly template. |
| What does support need later? | Real products need an answer when a person disputes a change. | Every booking, refund, override, and notification has a traceable record. |

## Working process

### 1. Map the real workflow

I would talk through the current tools, handoffs, and exceptions with the people who do the work. The goal is to understand what happens before a user clicks a button: how a class is created, who decides a refund, why a schedule moves, and which information each role needs.

### 2. Turn ambiguity into decisions

I would keep a rules matrix for the decisions most likely to become expensive later:

- Credit cost and cancellation cutoff by class type.
- Capacity, instructor, room, and member scheduling conflicts.
- Who can create, edit, cancel, override, or view each record.
- What a member sees when a class fills, changes, or is cancelled.
- Which actions are immediate and which require review, payment confirmation, or a job.

The working output can be concise: user stories, acceptance scenarios, a rules table, rough screen flows, and a technical outline. The format matters less than making policy visible before it becomes hidden logic.

### 3. Shape the system around those decisions

Once the rules are agreed, I would define the source-of-truth records, API commands, audit boundaries, and the projections each workspace needs. This is where a frontend concept becomes a system that can tolerate retries, schedule changes, and support questions.

### 4. Build in useful slices

| Slice | Product result | Engineering result |
| --- | --- | --- |
| Foundation | Sign-in, roles, member/studio scope | Tenant boundary, authorization, audit base |
| Catalog and schedule | Browse classes and view dates | Templates, occurrences, recurrence, exceptions |
| Booking | Confirm, cancel, join waitlist | Enrollment transaction, ledger, notifications |
| Studio operations | Create sessions and see rosters | Conflict checks, operations API, projections |
| Hardening | Clear errors and support visibility | Integration/E2E coverage, jobs, monitoring |

## What I would review with stakeholders

- A member can explain the price, cancellation outcome, and next state before confirming.
- A studio manager can see the operational effect of a class change before publishing it.
- The same booking reads consistently in the member schedule, roster, and support record.
- A product decision has a named owner when it is a business choice, rather than being silently decided in code.
- The happy path and the likely exceptions are accepted before the team expands the scope.

## Related design references

- [Production architecture](./studio-production-architecture.md)
- [Data model](./studio-data-model.md)
- [Behavior rules](./studio-behavior-spec.md)
