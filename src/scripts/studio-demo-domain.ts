export type PartnerRole = 'Partner Admin' | 'Front Desk' | 'Trainer';

export type Booking = {
  sessionId: string;
  credits: number;
  status: 'confirmed' | 'pending-member-approval';
  requestedAt?: number;
  expiresAt?: number;
  enrolledBy: 'member' | 'partner' | 'admin';
};

export type DemoBooking = Booking & { memberName?: string };

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
      bookings: bookings.filter((booking) => booking !== request),
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
      bookings: bookings.map((booking) => booking === request ? { ...booking, ...confirmed } : booking),
      credits: credits - request.credits,
      outcome: 'approved',
      releasedSeats: 0,
    };
  }

  return {
    bookings: bookings.filter((booking) => booking !== request),
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
    && (booking.memberName === memberName || booking.memberName === undefined));
  if (!removed) return { bookings, credits, releasedSeats: 0, removed: null };
  const pending = removed.status === 'pending-member-approval';
  return {
    bookings: bookings.filter((booking) => booking !== removed),
    credits: credits + (!pending && refundCredits ? removed.credits : 0),
    releasedSeats: 1,
    removed,
  };
}

export function cancelSessionEnrollments(
  bookings: DemoBooking[],
  sessionId: string,
  credits: number,
  refundCredits: boolean,
): EnrollmentRemovalResult {
  const removed = bookings.filter((booking) => booking.sessionId === sessionId);
  const refund = refundCredits
    ? removed.filter((booking) => booking.status === 'confirmed').reduce((total, booking) => total + booking.credits, 0)
    : 0;
  return {
    bookings: bookings.filter((booking) => booking.sessionId !== sessionId),
    credits: credits + refund,
    releasedSeats: removed.length,
    removed: removed[0] ?? null,
  };
}
