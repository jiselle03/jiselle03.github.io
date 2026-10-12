import { describe, expect, it } from 'vitest';
import {
  adjustCredits,
  changeOccurrenceSeats,
  canPartnerEnrollRepeatMember,
  canBookSession,
  canPerformRoleAction,
  canManageRoster,
  canManageStudio,
  cancelSessionEnrollments,
  createEnrollment,
  decideEnrollmentRequest,
  manualEnrollmentHold,
  expandClassOccurrences,
  joinWaitlist,
  promoteNextWaitlisted,
  pendingHoldExpired,
  removeEnrollment,
  removeEnrollmentRecord,
  resolveEnrollmentApproval,
  resolveManualEnrollment,
  occurrenceSeats,
} from '../src/scripts/studio-demo-domain';

const reformer = { sessionId: 'reformer', credits: 2, weekday: 4, startMinutes: 18 * 60, durationMinutes: 50 };

describe('Set demo booking rules', () => {
  it('allows separate-day and same-day non-overlapping bookings when credits and seats allow', () => {
    expect(canBookSession({ ...reformer, sessionId: 'other', startMinutes: 20 * 60 }, [reformer], 4, 1)).toBe(true);
    expect(canBookSession({ ...reformer, sessionId: 'friday', weekday: 5 }, [reformer], 4, 1)).toBe(true);
  });

  it('blocks duplicate, overlapping, unaffordable, and full bookings', () => {
    expect(canBookSession(reformer, [reformer], 6, 2)).toBe(false);
    expect(canBookSession({ ...reformer, sessionId: 'overlap', startMinutes: 18 * 60 + 30 }, [reformer], 6, 2)).toBe(false);
    expect(canBookSession(reformer, [], 1, 2)).toBe(false);
    expect(canBookSession(reformer, [], 6, 0)).toBe(false);
  });

  it('allows the same weekday time in different dated occurrences', () => {
    expect(canBookSession({ ...reformer, sessionId: 'reformer@2026-10-19', occurrenceDate: '2026-10-19' }, [{ ...reformer, sessionId: 'reformer@2026-10-12', occurrenceDate: '2026-10-12' }], 4, 1)).toBe(true);
  });
});

describe('Set demo partner permissions', () => {
  it('scopes partner administration to their studio and role', () => {
    expect(canManageStudio('Partner Admin', 'Form House', 'Form House')).toBe(true);
    expect(canManageStudio('Partner Admin', 'Stone Club', 'Form House')).toBe(false);
    expect(canManageStudio('Front Desk', 'Form House', 'Form House')).toBe(false);
    expect(canManageRoster('Front Desk', 'Form House', 'Form House')).toBe(true);
    expect(canManageRoster('Trainer', 'Form House', 'Form House')).toBe(false);
    expect(canManageRoster('Partner Admin', 'Northside Gym', 'Form House')).toBe(false);
  });
});

describe('Set demo manual enrollment approval', () => {
  it('holds a seat for 24 hours and releases it on decline or expiry', () => {
    const pending = manualEnrollmentHold('reformer', 2, 1000);
    expect(pending.expiresAt).toBe(1000 + 24 * 60 * 60 * 1000);
    expect(pendingHoldExpired(pending, pending.expiresAt! - 1)).toBe(false);
    expect(pendingHoldExpired(pending, pending.expiresAt!)).toBe(true);
    expect(resolveManualEnrollment(pending, 'decline')).toBeNull();
    expect(resolveManualEnrollment(pending, 'expire')).toBeNull();
  });

  it('charges nothing until the member approves the held seat', () => {
    const pending = manualEnrollmentHold('reformer', 2, 1000);
    expect(pending.status).toBe('pending-member-approval');
    expect(resolveManualEnrollment(pending, 'approve')).toMatchObject({ status: 'confirmed', credits: 2 });
  });

  it('confirms an eligible request, spends credits once, and keeps the held seat', () => {
    const pending = { ...manualEnrollmentHold('reformer', 2, 1000), memberName: 'Alex Park' };
    const result = decideEnrollmentRequest([pending], 'reformer', 'Alex Park', 'approve', 1001, 6, reformer, []);
    expect(result).toMatchObject({ credits: 4, outcome: 'approved', releasedSeats: 0 });
    expect(result.bookings[0]).toMatchObject({ status: 'confirmed', memberName: 'Alex Park' });
  });

  it('leaves a request on hold when approval would overdraw credits or overlap', () => {
    const pending = { ...manualEnrollmentHold('reformer', 2, 1000), memberName: 'Alex Park' };
    const noCredits = decideEnrollmentRequest([pending], 'reformer', 'Alex Park', 'approve', 1001, 1, reformer, []);
    const overlap = decideEnrollmentRequest([pending], 'reformer', 'Alex Park', 'approve', 1001, 6, reformer, [{ ...reformer, sessionId: 'another' }]);
    expect(noCredits).toMatchObject({ outcome: 'blocked', credits: 1, releasedSeats: 0 });
    expect(overlap).toMatchObject({ outcome: 'blocked', credits: 6, releasedSeats: 0 });
    expect(noCredits.bookings[0].status).toBe('pending-member-approval');
  });

  it('expires at the deadline even when the member tries to approve', () => {
    const pending = { ...manualEnrollmentHold('reformer', 2, 1000), memberName: 'Alex Park' };
    const result = decideEnrollmentRequest([pending], 'reformer', 'Alex Park', 'approve', pending.expiresAt!, 6, reformer, []);
    expect(result).toMatchObject({ credits: 6, outcome: 'expired', releasedSeats: 1 });
    expect(result.bookings[0].status).toBe('expired');
  });

  it('declines without charging and releases the held seat', () => {
    const pending = { ...manualEnrollmentHold('reformer', 2, 1000), memberName: 'Alex Park' };
    const result = decideEnrollmentRequest([pending], 'reformer', 'Alex Park', 'decline', 1001, 6, reformer, []);
    expect(result).toMatchObject({ credits: 6, outcome: 'declined', releasedSeats: 1 });
    expect(result.bookings[0].status).toBe('cancelled');
  });
});

describe('Set demo enrollment removal outcomes', () => {
  const memberBooking = { sessionId: 'reformer', memberName: 'Alex Park', credits: 2, status: 'confirmed' as const, enrolledBy: 'member' as const };
  const otherBooking = { ...memberBooking, sessionId: 'other-class' };

  it('cancels one enrollment while preserving other bookings and applying the refund rule', () => {
    const onTime = removeEnrollment([memberBooking, otherBooking], 'reformer', 'Alex Park', 4, true);
    const late = removeEnrollment([memberBooking, otherBooking], 'reformer', 'Alex Park', 4, false);
    expect(onTime).toMatchObject({ credits: 6, releasedSeats: 1 });
    expect(onTime.bookings.map((item) => item.status)).toEqual(['cancelled', 'confirmed']);
    expect(late).toMatchObject({ credits: 4, releasedSeats: 1 });
    expect(late.bookings[0]).toMatchObject({ status: 'cancelled', creditsReturned: 0 });
  });

  it('cancels every session enrollment but refunds only confirmed bookings', () => {
    const pending = { ...manualEnrollmentHold('reformer', 3, 1000), memberName: 'Mara Lin' };
    const result = cancelSessionEnrollments([memberBooking, pending, otherBooking], 'reformer', 4, true);
    expect(result).toMatchObject({ credits: 6, releasedSeats: 2 });
    expect(result.bookings.map((item) => item.status)).toEqual(['cancelled', 'cancelled', 'confirmed']);
  });
});

describe('dated occurrences and recurring class definitions', () => {
  it('keeps capacity independent between dates and clamps seat changes', () => {
    const afterBooking = changeOccurrenceSeats({}, 'yoga@2026-10-05', 2, 10, -1);
    expect(occurrenceSeats(afterBooking, 'yoga@2026-10-05', 2)).toBe(1);
    expect(occurrenceSeats(afterBooking, 'yoga@2026-10-12', 2)).toBe(2);
    expect(changeOccurrenceSeats(afterBooking, 'yoga@2026-10-05', 2, 10, 50)['yoga@2026-10-05']).toBe(10);
    expect(changeOccurrenceSeats(afterBooking, 'yoga@2026-10-05', 2, 10, -5)['yoga@2026-10-05']).toBe(0);
  });

  it('expands weekly definitions to dated ids and one-off definitions exactly once', () => {
    const weekly = expandClassOccurrences({ id: 'yoga', studioId: 'form-house', startsOn: '2026-10-05', recurrence: 'weekly', weekday: 1 }, '2026-10-01', '2026-10-20');
    expect(weekly.map((item) => item.id)).toEqual(['yoga@2026-10-05', 'yoga@2026-10-12', 'yoga@2026-10-19']);
    expect(expandClassOccurrences({ id: 'pop-up', studioId: 'form-house', startsOn: '2026-10-09', recurrence: 'once' }, '2026-10-01', '2026-10-20')).toEqual([
      { id: 'pop-up@2026-10-09', definitionId: 'pop-up', studioId: 'form-house', date: '2026-10-09' },
    ]);
  });

  it('stops a recurring definition at its end date and ignores invalid ranges', () => {
    const definition = { id: 'yoga', studioId: 'form-house', startsOn: '2026-10-05', endsOn: '2026-10-12', recurrence: 'weekly' as const, weekday: 1 };
    expect(expandClassOccurrences(definition, '2026-10-01', '2026-10-30')).toHaveLength(2);
    expect(expandClassOccurrences(definition, '2026-10-20', '2026-10-01')).toEqual([]);
  });
});

describe('role permissions and repeat-member privacy', () => {
  it('allows only scoped partner capabilities and reserves account overrides for Set Admin', () => {
    expect(canPerformRoleAction('Front Desk', 'remove-enrollment', 'form-house', 'form-house')).toBe(true);
    expect(canPerformRoleAction('Front Desk', 'remove-enrollment', 'stone-club', 'form-house')).toBe(false);
    expect(canPerformRoleAction('Trainer', 'remove-enrollment', 'form-house', 'form-house')).toBe(false);
    expect(canPerformRoleAction('Partner Admin', 'change-member-status', 'form-house', 'form-house')).toBe(false);
    expect(canPerformRoleAction('Set Admin', 'change-member-status')).toBe(true);
  });

  it('lets a studio request enrollment only for an already-associated member', () => {
    expect(canPartnerEnrollRepeatMember(['form-house'], 'form-house')).toBe(true);
    expect(canPartnerEnrollRepeatMember(['form-house'], 'stone-club')).toBe(false);
  });
});

describe('unified enrollment transitions', () => {
  const initial = createEnrollment({ id: 'e1', occurrenceId: 'reformer@2026-10-12', memberId: 'alex', memberName: 'Alex Park', studioId: 'form-house', createdBy: 'partner', now: 1_000, credits: 2 });

  it('holds partner-assisted seats without spending credits and requires affirmative approval', () => {
    expect(initial).toMatchObject({ status: 'pending-member-approval', creditsCharged: 0, expiresAt: 1_000 + 86_400_000 });
    const denied = resolveEnrollmentApproval([initial], 'e1', 'decline', 2_000, 6, 2, 'Alex Park');
    expect(denied).toMatchObject({ outcome: 'declined', releasedSeats: 1, credits: 6 });
    expect(denied.enrollments[0].status).toBe('cancelled');
  });

  it('confirms once, charges on approval, blocks insufficient credits, and expires silently', () => {
    const approved = resolveEnrollmentApproval([initial], 'e1', 'approve', 2_000, 6, 2, 'Alex Park');
    expect(approved).toMatchObject({ outcome: 'approved', releasedSeats: 0, credits: 4 });
    expect(approved.enrollments[0]).toMatchObject({ status: 'confirmed', creditsCharged: 2 });
    expect(resolveEnrollmentApproval([initial], 'e1', 'approve', 2_000, 1, 2, 'Alex Park').outcome).toBe('blocked');
    expect(resolveEnrollmentApproval([initial], 'e1', 'approve', initial.expiresAt!, 6, 2, 'Alex Park')).toMatchObject({ outcome: 'expired', releasedSeats: 1, credits: 6 });
  });

  it('records removal outcomes and requires a reason for admin credit adjustments', () => {
    const confirmed = { ...initial, status: 'confirmed' as const, creditsCharged: 2 };
    const removed = removeEnrollmentRecord([confirmed], 'e1', 4, true, 'Jordan Lee', 'Studio removed duplicate enrollment', 2_000);
    expect(removed).toMatchObject({ outcome: 'removed', credits: 6, releasedSeats: 1 });
    expect(removed.events[0]).toMatchObject({ actor: 'Jordan Lee', action: 'removed', reason: 'Studio removed duplicate enrollment' });
    expect(adjustCredits(4, 1, '', 'Priya Shah', 'alex', 2_000).event).toBeNull();
    expect(adjustCredits(4, 1, 'Goodwill adjustment', 'Priya Shah', 'alex', 2_000)).toMatchObject({ credits: 5, event: { action: 'credit-adjusted', reason: 'Goodwill adjustment' } });
  });

  it('queues members in join order and offers the next seat for explicit approval', () => {
    const first = joinWaitlist([], { id: 'wait-1', occurrenceId: 'reformer@2026-10-12', memberId: 'mara', memberName: 'Mara Lin', studioId: 'form-house', createdBy: 'member', now: 100, credits: 2 }).entry!;
    const second = joinWaitlist([first], { id: 'wait-2', occurrenceId: first.occurrenceId, memberId: 'dae', memberName: 'Dae Kim', studioId: 'form-house', createdBy: 'member', now: 200, credits: 2 }).entry!;
    expect([first.waitlistPosition, second.waitlistPosition]).toEqual([1, 2]);
    const promotion = promoteNextWaitlisted([second, first], first.occurrenceId, 300);
    expect(promotion.promoted).toMatchObject({ id: 'wait-1', status: 'pending-member-approval', expiresAt: 300 + 86_400_000, creditsCharged: 0 });
    expect(promotion.enrollments.find((item) => item.id === 'wait-2')?.waitlistPosition).toBe(1);
  });

  it('prevents duplicate active enrollment or waitlist entries for one occurrence', () => {
    const waiting = joinWaitlist([], { id: 'wait-1', occurrenceId: 'reformer@2026-10-12', memberId: 'mara', memberName: 'Mara Lin', studioId: 'form-house', createdBy: 'member', now: 100, credits: 2 }).entry!;
    expect(joinWaitlist([waiting], { id: 'wait-2', occurrenceId: waiting.occurrenceId, memberId: 'mara', memberName: 'Mara Lin', studioId: 'form-house', createdBy: 'member', now: 200, credits: 2 }).entry).toBeNull();
  });
});
