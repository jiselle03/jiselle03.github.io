export type PartnerRole = 'Partner Admin' | 'Front Desk' | 'Trainer';

export type EnrollmentStatus =
  | 'confirmed'
  | 'pending-member-approval'
  | 'waitlisted'
  | 'cancelled'
  | 'expired';

export type EnrollmentActor = 'member' | 'partner' | 'admin';

export type ClassDefinition = {
  id: string;
  studioId: string;
  startsOn: string;
  recurrence: 'weekly' | 'once';
  weekday?: number;
  endsOn?: string;
};

export type ClassOccurrence = {
  id: string;
  definitionId: string;
  studioId: string;
  date: string;
};

export function occurrenceSeats(
  seatCounts: Record<string, number>,
  occurrenceId: string,
  initialAvailable: number,
): number {
  return seatCounts[occurrenceId] ?? initialAvailable;
}

export function changeOccurrenceSeats(
  seatCounts: Record<string, number>,
  occurrenceId: string,
  initialAvailable: number,
  capacity: number,
  delta: number,
): Record<string, number> {
  const current = occurrenceSeats(seatCounts, occurrenceId, initialAvailable);
  return { ...seatCounts, [occurrenceId]: Math.max(0, Math.min(capacity, current + delta)) };
}

export type Enrollment = {
  id: string;
  occurrenceId: string;
  memberId: string;
  memberName: string;
  studioId: string;
  status: EnrollmentStatus;
  createdBy: EnrollmentActor;
  creditsCharged: number;
  creditsReturned: number;
  createdAt: number;
  expiresAt?: number;
  reason?: string;
  waitlistPosition?: number;
};

export type RoleAction = 'view-schedule' | 'view-roster' | 'request-enrollment' | 'remove-enrollment' | 'manage-class' | 'manage-staff' | 'adjust-credit' | 'change-member-status';

export type DemoRole = 'Member' | PartnerRole | 'Set Admin';

export type EnrollmentEvent = {
  id: string;
  enrollmentId: string;
  actor: string;
  action: 'requested' | 'approved' | 'declined' | 'expired' | 'removed' | 'cancelled' | 'credit-adjusted';
  reason: string;
  at: number;
};

export type EnrollmentTransition = {
  enrollments: Enrollment[];
  events: EnrollmentEvent[];
  credits: number;
  outcome: 'confirmed' | 'pending' | 'waitlisted' | 'approved' | 'declined' | 'expired' | 'removed' | 'blocked' | 'missing';
  releasedSeats: number;
};

const PARTNER_ACTIONS: Record<RoleAction, DemoRole[]> = {
  'view-schedule': ['Partner Admin', 'Front Desk', 'Trainer', 'Set Admin'],
  'view-roster': ['Partner Admin', 'Front Desk', 'Trainer', 'Set Admin'],
  'request-enrollment': ['Partner Admin', 'Front Desk', 'Set Admin'],
  'remove-enrollment': ['Partner Admin', 'Front Desk', 'Set Admin'],
  'manage-class': ['Partner Admin', 'Set Admin'],
  'manage-staff': ['Partner Admin', 'Set Admin'],
  'adjust-credit': ['Set Admin'],
  'change-member-status': ['Set Admin'],
};

export function canPerformRoleAction(role: DemoRole, action: RoleAction, studioId?: string, partnerStudioId?: string): boolean {
  if (!PARTNER_ACTIONS[action].includes(role)) return false;
  if (role === 'Set Admin') return true;
  if (role === 'Member') return false;
  return studioId !== undefined && studioId === partnerStudioId;
}

export function expandClassOccurrences(definition: ClassDefinition, from: string, through: string): ClassOccurrence[] {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${through}T12:00:00`);
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || start > end) return [];
  const first = new Date(`${definition.startsOn}T12:00:00`);
  if (Number.isNaN(first.valueOf())) return [];
  const last = definition.endsOn ? new Date(`${definition.endsOn}T12:00:00`) : end;
  const dates: string[] = [];
  if (definition.recurrence === 'once') {
    if (first >= start && first <= end) dates.push(definition.startsOn);
  } else {
    const weekday = definition.weekday ?? first.getDay();
    const cursor = new Date(Math.max(first.valueOf(), start.valueOf()));
    cursor.setDate(cursor.getDate() + ((weekday - cursor.getDay() + 7) % 7));
    while (cursor <= end && cursor <= last) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 7);
    }
  }
  return dates.map((date) => ({ id: `${definition.id}@${date}`, definitionId: definition.id, studioId: definition.studioId, date }));
}

export function occurrenceBookingCandidate(candidate: BookingCandidate, occurrenceId: string): BookingCandidate {
  return { ...candidate, sessionId: occurrenceId };
}

export function canPartnerEnrollRepeatMember(memberStudios: string[], targetStudio: string): boolean {
  return memberStudios.includes(targetStudio);
}

export function createEnrollment(input: Omit<Enrollment, 'id' | 'status' | 'createdAt' | 'creditsCharged' | 'creditsReturned'> & { id?: string; now: number; credits: number; waitlistPosition?: number }): Enrollment {
  const pending = input.createdBy === 'partner';
  return {
    id: input.id ?? `enrollment-${input.now}`,
    occurrenceId: input.occurrenceId,
    memberId: input.memberId,
    memberName: input.memberName,
    studioId: input.studioId,
    status: input.waitlistPosition !== undefined ? 'waitlisted' : pending ? 'pending-member-approval' : 'confirmed',
    createdBy: input.createdBy,
    creditsCharged: pending || input.waitlistPosition ? 0 : input.credits,
    creditsReturned: 0,
    createdAt: input.now,
    ...(pending ? { expiresAt: input.now + 24 * 60 * 60 * 1000 } : {}),
    ...(input.reason ? { reason: input.reason } : {}),
    ...(input.waitlistPosition !== undefined ? { waitlistPosition: input.waitlistPosition } : {}),
  };
}

export function joinWaitlist(enrollments: Enrollment[], input: Omit<Parameters<typeof createEnrollment>[0], 'waitlistPosition'>): { enrollments: Enrollment[]; entry: Enrollment | null } {
  const duplicate = enrollments.some((item) => item.occurrenceId === input.occurrenceId && item.memberId === input.memberId && ['confirmed', 'pending-member-approval', 'waitlisted'].includes(item.status));
  if (duplicate) return { enrollments, entry: null };
  const rank = enrollments.filter((item) => item.occurrenceId === input.occurrenceId && item.status === 'waitlisted').length + 1;
  const entry = createEnrollment({ ...input, waitlistPosition: rank });
  return { enrollments: [...enrollments, entry], entry };
}

export function promoteNextWaitlisted(enrollments: Enrollment[], occurrenceId: string, now: number): { enrollments: Enrollment[]; promoted: Enrollment | null } {
  const next = enrollments.filter((item) => item.occurrenceId === occurrenceId && item.status === 'waitlisted').sort((left, right) => (left.waitlistPosition ?? Number.MAX_SAFE_INTEGER) - (right.waitlistPosition ?? Number.MAX_SAFE_INTEGER) || left.createdAt - right.createdAt)[0];
  if (!next) return { enrollments, promoted: null };
  const promoted: Enrollment = { ...next, status: 'pending-member-approval', expiresAt: now + 24 * 60 * 60 * 1000, reason: 'Waitlist offer; member approval required' };
  const nextRank = enrollments.filter((item) => item.occurrenceId === occurrenceId && item.status === 'waitlisted' && item.id !== next.id).sort((left, right) => (left.waitlistPosition ?? 0) - (right.waitlistPosition ?? 0));
  const shifted = new Map(nextRank.map((item, index) => [item.id, index + 1]));
  return { enrollments: enrollments.map((item) => item.id === next.id ? promoted : shifted.has(item.id) ? { ...item, waitlistPosition: shifted.get(item.id) } : item), promoted };
}

export function resolveEnrollmentApproval(
  enrollments: Enrollment[], enrollmentId: string, decision: 'approve' | 'decline', now: number,
  credits: number, creditCost: number, actor: string,
): EnrollmentTransition {
  const request = enrollments.find((item) => item.id === enrollmentId && item.status === 'pending-member-approval');
  if (!request) return { enrollments, events: [], credits, outcome: 'missing', releasedSeats: 0 };
  const action = decision === 'approve' && (request.expiresAt ?? 0) > now && credits >= creditCost ? 'approved' : decision === 'decline' ? 'declined' : (request.expiresAt ?? 0) <= now ? 'expired' : 'blocked';
  if (action === 'blocked') return { enrollments, events: [], credits, outcome: 'blocked', releasedSeats: 0 };
  const nextStatus: EnrollmentStatus = action === 'approved' ? 'confirmed' : action === 'expired' ? 'expired' : 'cancelled';
  const updated = { ...request, status: nextStatus, creditsCharged: action === 'approved' ? creditCost : 0 };
  const eventAction = action === 'approved' ? 'approved' : action;
  const event: EnrollmentEvent = { id: `${request.id}:${eventAction}:${now}`, enrollmentId: request.id, actor, action: eventAction, reason: action === 'expired' ? 'Approval window elapsed; seat released' : action, at: now };
  return {
    enrollments: enrollments.map((item) => item.id === enrollmentId ? updated : item),
    events: [event],
    credits: credits - updated.creditsCharged,
    outcome: action,
    releasedSeats: action === 'approved' ? 0 : 1,
  };
}

export function removeEnrollmentRecord(enrollments: Enrollment[], enrollmentId: string, credits: number, refundCredits: boolean, actor: string, reason: string, now: number): EnrollmentTransition {
  const target = enrollments.find((item) => item.id === enrollmentId && ['confirmed', 'pending-member-approval', 'waitlisted'].includes(item.status));
  if (!target) return { enrollments, events: [], credits, outcome: 'missing', releasedSeats: 0 };
  const refund = target.status === 'confirmed' && refundCredits ? target.creditsCharged : 0;
  const updated: Enrollment = { ...target, status: 'cancelled', creditsReturned: refund, reason };
  const event: EnrollmentEvent = { id: `${target.id}:removed:${now}`, enrollmentId: target.id, actor, action: 'removed', reason, at: now };
  return { enrollments: enrollments.map((item) => item.id === target.id ? updated : item), events: [event], credits: credits + refund, outcome: 'removed', releasedSeats: 1 };
}

export function adjustCredits(credits: number, delta: number, reason: string, actor: string, memberId: string, now: number): { credits: number; event: EnrollmentEvent | null } {
  if (!Number.isFinite(delta) || !Number.isInteger(delta) || !reason.trim() || credits + delta < 0 || delta === 0) return { credits, event: null };
  const event: EnrollmentEvent = { id: `credit:${memberId}:${now}`, enrollmentId: memberId, actor, action: 'credit-adjusted', reason: reason.trim(), at: now };
  return { credits: credits + delta, event };
}

export type Booking = {
  sessionId: string;
  credits: number;
  status: EnrollmentStatus;
  requestedAt?: number;
  expiresAt?: number;
  enrolledBy: 'member' | 'partner' | 'admin';
};

export type DemoBooking = Booking & { memberName?: string; cancellationPolicy?: string };

export type EnrollmentDecisionResult = {
  bookings: DemoBooking[];
  credits: number;
  outcome: 'approved' | 'declined' | 'expired' | 'blocked' | 'missing';
  releasedSeats: number;
};

export type BookingCandidate = {
  sessionId: string;
  credits: number;
  weekday: number;
  startMinutes: number;
  durationMinutes: number;
  occurrenceDate?: string;
};

export function canBookSession(
  candidate: BookingCandidate,
  bookings: BookingCandidate[],
  credits: number,
  availableSeats: number,
): boolean {
  if (credits < candidate.credits || availableSeats < 1) return false;
  return !bookings.some((booking) => {
    if (booking.sessionId === candidate.sessionId) return true;
    if ((booking.occurrenceDate || candidate.occurrenceDate) && booking.occurrenceDate !== candidate.occurrenceDate) return false;
    if (booking.weekday !== candidate.weekday) return false;
    return candidate.startMinutes < booking.startMinutes + booking.durationMinutes
      && candidate.startMinutes + candidate.durationMinutes > booking.startMinutes;
  });
}

export function canManageStudio(role: PartnerRole, studio: string, partnerStudio: string): boolean {
  return studio === partnerStudio && role === 'Partner Admin';
}

export function canManageRoster(role: PartnerRole, studio: string, partnerStudio: string): boolean {
  return studio === partnerStudio && role !== 'Trainer';
}

export function manualEnrollmentHold(
  sessionId: string,
  credits: number,
  now: number,
  holdHours = 24,
): Booking {
  return {
    sessionId,
    credits,
    status: 'pending-member-approval',
    requestedAt: now,
    expiresAt: now + holdHours * 60 * 60 * 1000,
    enrolledBy: 'partner',
  };
}

export function resolveManualEnrollment(booking: Booking, decision: 'approve' | 'decline' | 'expire'): Booking | null {
  if (booking.status !== 'pending-member-approval') return booking;
  if (decision !== 'approve') return null;
  return { ...booking, status: 'confirmed' };
}

export function pendingHoldExpired(booking: Booking, now: number): boolean {
  return booking.status === 'pending-member-approval' && (booking.expiresAt ?? 0) <= now;
}

export function decideEnrollmentRequest(
  bookings: DemoBooking[],
  sessionId: string,
  memberName: string,
  decision: 'approve' | 'decline',
  now: number,
  credits: number,
  candidate: BookingCandidate,
  confirmedBookings: BookingCandidate[],
): EnrollmentDecisionResult {
  const request = bookings.find((booking) => booking.sessionId === sessionId
    && booking.memberName === memberName
    && booking.status === 'pending-member-approval');
  if (!request) return { bookings, credits, outcome: 'missing', releasedSeats: 0 };

  if (pendingHoldExpired(request, now)) {
    return {
      bookings: bookings.map((booking) => booking === request ? { ...booking, status: 'expired' } : booking),
      credits,
      outcome: 'expired',
      releasedSeats: 1,
    };
  }

  if (decision === 'approve') {
    const otherBookings = confirmedBookings.filter((booking) => booking.sessionId !== sessionId);
    if (!canBookSession(candidate, otherBookings, credits, 1)) {
      return { bookings, credits, outcome: 'blocked', releasedSeats: 0 };
    }
    const confirmed = resolveManualEnrollment(request, 'approve');
    if (!confirmed) return { bookings, credits, outcome: 'missing', releasedSeats: 0 };
    return {
      bookings: bookings.map((booking) => booking === request ? { ...booking, ...confirmed, creditsCharged: request.credits } : booking),
      credits: credits - request.credits,
      outcome: 'approved',
      releasedSeats: 0,
    };
  }

  return {
    bookings: bookings.map((booking) => booking === request ? { ...booking, status: 'cancelled', reason: 'Member declined the request' } : booking),
    credits,
    outcome: 'declined',
    releasedSeats: 1,
  };
}

export type EnrollmentRemovalResult = {
  bookings: DemoBooking[];
  credits: number;
  releasedSeats: number;
  removed: DemoBooking | null;
};

export function removeEnrollment(
  bookings: DemoBooking[],
  sessionId: string,
  memberName: string,
  credits: number,
  refundCredits: boolean,
): EnrollmentRemovalResult {
  const removed = bookings.find((booking) => booking.sessionId === sessionId
    && (booking.memberName === memberName || booking.memberName === undefined)
    && ['confirmed', 'pending-member-approval', 'waitlisted'].includes(booking.status));
  if (!removed) return { bookings, credits, releasedSeats: 0, removed: null };
  const pending = removed.status === 'pending-member-approval';
  const returned = !pending && refundCredits ? removed.credits : 0;
  const updated = { ...removed, status: 'cancelled' as const, creditsReturned: returned, reason: 'Enrollment removed' };
  return {
    bookings: bookings.map((booking) => booking === removed ? updated : booking),
    credits: credits + returned,
    releasedSeats: 1,
    removed: updated,
  };
}

export function cancelSessionEnrollments(
  bookings: DemoBooking[],
  sessionId: string,
  credits: number,
  refundCredits: boolean,
): EnrollmentRemovalResult {
  const removed = bookings.filter((booking) => booking.sessionId === sessionId
    && ['confirmed', 'pending-member-approval', 'waitlisted'].includes(booking.status));
  const refund = refundCredits
    ? removed.filter((booking) => booking.status === 'confirmed').reduce((total, booking) => total + booking.credits, 0)
    : 0;
  let returned = 0;
  const updated = bookings.map((booking) => {
    if (booking.sessionId !== sessionId || !removed.includes(booking)) return booking;
    const creditReturn = refundCredits && booking.status === 'confirmed' ? booking.credits : 0;
    returned += creditReturn;
    return { ...booking, status: 'cancelled' as const, creditsReturned: creditReturn, reason: 'Session cancelled by studio' };
  });
  return {
    bookings: updated,
    credits: credits + (returned || refund),
    releasedSeats: removed.length,
    removed: removed[0] ?? null,
  };
}
