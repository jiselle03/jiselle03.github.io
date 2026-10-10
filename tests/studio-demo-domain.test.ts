import { describe, expect, it } from 'vitest';
import {
  canBookSession,
  canManageRoster,
  canManageStudio,
  cancelSessionEnrollments,
  decideEnrollmentRequest,
  manualEnrollmentHold,
  pendingHoldExpired,
  removeEnrollment,
  resolveManualEnrollment,
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
    expect(result).toMatchObject({ credits: 6, outcome: 'expired', releasedSeats: 1, bookings: [] });
  });

  it('declines without charging and releases the held seat', () => {
    const pending = { ...manualEnrollmentHold('reformer', 2, 1000), memberName: 'Alex Park' };
    const result = decideEnrollmentRequest([pending], 'reformer', 'Alex Park', 'decline', 1001, 6, reformer, []);
    expect(result).toMatchObject({ credits: 6, outcome: 'declined', releasedSeats: 1, bookings: [] });
  });
});

describe('Set demo enrollment removal outcomes', () => {
  const memberBooking = { sessionId: 'reformer', memberName: 'Alex Park', credits: 2, status: 'confirmed' as const, enrolledBy: 'member' as const };
  const otherBooking = { ...memberBooking, sessionId: 'other-class' };

  it('cancels one enrollment while preserving other bookings and applying the refund rule', () => {
    const onTime = removeEnrollment([memberBooking, otherBooking], 'reformer', 'Alex Park', 4, true);
    const late = removeEnrollment([memberBooking, otherBooking], 'reformer', 'Alex Park', 4, false);
    expect(onTime).toMatchObject({ credits: 6, releasedSeats: 1, bookings: [otherBooking] });
    expect(late).toMatchObject({ credits: 4, releasedSeats: 1, bookings: [otherBooking] });
  });

  it('cancels every session enrollment but refunds only confirmed bookings', () => {
    const pending = { ...manualEnrollmentHold('reformer', 3, 1000), memberName: 'Mara Lin' };
    const result = cancelSessionEnrollments([memberBooking, pending, otherBooking], 'reformer', 4, true);
    expect(result).toMatchObject({ credits: 6, releasedSeats: 2, bookings: [otherBooking] });
  });
});
