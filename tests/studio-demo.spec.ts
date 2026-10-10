import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/pages/demo/studio.astro'), 'utf8');
const styles = readFileSync(resolve(root, 'src/styles/studio-clean.css'), 'utf8');
const portfolio = readFileSync(resolve(root, 'src/pages/index.astro'), 'utf8');
const built = readFileSync(resolve(root, 'dist/demo/studio/index.html'), 'utf8');

describe('Set demo role shell', () => {
  it('keeps account access in the signed-in identity control', () => {
    const dom = new JSDOM(built);
    expect(dom.window.document.querySelector('#signed-in-identity')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-view="account"]')).toBeNull();
    expect(dom.window.document.querySelector('[data-account-content="member"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-account-content="studio"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-account-content="admin"]')).not.toBeNull();
    expect(dom.window.document.querySelector('#notifications-button')).not.toBeNull();
    expect(dom.window.document.querySelector('#notifications-panel')).not.toBeNull();
    expect(styles).not.toContain('.sf-signed-in-identity::after');
  });

  it('uses one guided entry surface for partner and admin roles', () => {
    expect(source).toContain("showStudioGuide('Step 1 of 2 · Add a class'");
    expect(source).toContain("if (mode === 'admin') {");
    expect(source).not.toContain("const briefId = isPartner ? '#studio-brief'");
    expect(source).toContain('Explore on my own');
    expect(source).toContain("if (event.key !== 'Escape') return");
  });

  it('keeps role identity clear and preserves partner/admin workspaces on refresh', () => {
    expect(source).toContain("window.history.replaceState({}, '', url)");
    expect(source).toContain("url.searchParams.set('role', mode === 'studio' ? 'partner' : 'admin')");
    expect(source).toContain("mode === 'admin' ? 'Platform operations' : mode === 'studio' ? 'Studio operations' : 'Membership network'");
    expect(styles).toContain('.sf-product-bar[data-mode="admin"]{border-top:.25rem solid var(--lime)}');
    expect(styles).toContain('.sf-product-bar[data-mode="studio"]{border-top:.25rem solid var(--pink)}');
  });

  it('gives each first-run brief and icon-only button a readable name', () => {
    const dom = new JSDOM(built);
    const document = dom.window.document;
    for (const id of ['scenario-brief', 'studio-brief', 'admin-brief']) {
      const brief = document.querySelector(`#${id}`);
      expect(brief, `${id} exists`).not.toBeNull();
      expect(brief?.getAttribute('aria-labelledby') || brief?.getAttribute('aria-label')).toBeTruthy();
    }
    const unnamedButtons = [...document.querySelectorAll('button')].filter((button) =>
      !button.textContent?.trim() && !button.getAttribute('aria-label') && !button.getAttribute('title'),
    );
    expect(unnamedButtons.map((button) => button.outerHTML)).toEqual([]);
  });

  it('keeps the member browse controls single-purpose', () => {
    expect(source).not.toContain('data-home-filter');
    const dom = new JSDOM(built);
    expect(dom.window.document.querySelector('.sf-category-strip')).toBeNull();
  });
});

describe('Set demo activity and cancellation contracts', () => {
  it('is discoverable from the portfolio navigation', () => {
    expect(portfolio).toContain("{ label: 'Demo', href: '/demo/studio/' }");
  });

  it('renders the activity list as a bounded content region', () => {
    const dom = new JSDOM(built);
    const activity = dom.window.document.querySelector('#activity-list');
    expect(activity?.classList.contains('sf-activity')).toBe(true);
    expect(activity?.tagName).toBe('OL');
  });

  it('keeps cancellation as an explicit button with a confirmation dialog', () => {
    expect(source).toContain('id="cancel-booking" class="sf-quiet-action"');
    expect(source).toContain('id="cancellation-dialog"');
    expect(source).toContain("get('#cancellation-confirm').addEventListener");
  });

  it('makes schedule days interactive and count-only', () => {
    expect(source).toContain('data-schedule-day');
    expect(source).toContain('aria-pressed="${day === activeDay}"');
    expect(source).toContain("${count} ${count === 1 ? 'class' : 'classes'}");
    expect(source).toContain('activeDay = Number(button.dataset.scheduleDay)');
  });

  it('keeps admin partner records separate from member support actions', () => {
    expect(source).toContain("get('#admin-record-kicker').textContent = members ? 'Selected member' : 'Selected partner'");
    expect(source).toContain("get('#admin-member-name').textContent = 'Form House'");
    expect(source).toContain("get<HTMLButtonElement>('#admin-credit-adjust').hidden = !members");
  });

  it('scopes partner actions in the roster and guards mutations by role and studio', () => {
    expect(source).toContain('sessions.filter((session) => session.studio === partnerStudio)');
    expect(source).toContain('const partnerSessionAllowed = (sessionId: string, action:');
    expect(source).toContain("document.addEventListener('submit', (event) => { if (mode !== 'studio') return;");
    expect(source).toContain('selectedStudio === partnerStudio');
    expect(source).toContain("activeDay = new Date().getDay()");
  });

  it('moves the booking guide away from the control it describes', () => {
    expect(source).toContain("target === '#booking-button'");
    expect(source).toContain('is-booking-guide');
    expect(source).toContain('Use ${direction} day to reach the bouldering intro.');
    expect(source).toContain('advanceIntroGuideToBooking()');
    expect(source).toContain("block: window.matchMedia('(max-width: 720px)').matches ? 'start' : 'center'");
    expect(source).toContain("document.body.classList.add('has-active-tour')");
    expect(source).toContain('stopStudioGuide(); const intro');
  });

  it('defines separate notification copy for each role', () => {
    expect(source).toContain('Approval needed · Form House');
    expect(source).toContain('Approval received · Nina Hsu');
    expect(source).toContain('Approval pending · Alex Park');
    expect(source).toContain('notificationsButton.addEventListener');
    expect(source).toContain("'Booking removed · Form House'");
    expect(source).toContain("isPending ? 'Release hold' : isMemberBooking ? 'Remove from roster' : 'Unenroll'");
  });

  it('routes partner enrollment through a held seat and explicit member decision', () => {
    expect(source).toContain('manualEnrollmentHold(session.id, session.credits, Date.now())');
    expect(source).toContain("data-enrollment-decision=\"approve\"");
    expect(source).toContain("button.dataset.enrollmentDecision === 'approve' ? 'approve' : 'decline'");
    expect(source).toContain('decideEnrollmentRequest(bookings, sessionId, demoMemberName, decision');
    expect(source).toContain('pendingHoldExpired(booking, Date.now())');
    expect(source).toContain('session.availability + transition.releasedSeats');
    expect(source).toContain('partnerNotification = { label: \'Enrollment approved\'');
    expect(readFileSync(resolve(root, 'src/scripts/studio-demo-domain.ts'), 'utf8')).toContain('pendingHoldExpired(request, now)');
  });

  it('starts Admin on the panel containing its guided support action', () => {
    expect(source).toContain("if (mode === 'admin') { get<HTMLElement>('#admin-nav').hidden = false; setAdminPanel('dashboard'); }");
    expect(source).toContain("const members = partnerDirectory.hidden;");
    expect(source).toContain("showStudioGuide('Step 1 of 1 · Support credit'");
  });

  it('uses a section-specific Admin title and gives directory entries breathing room', () => {
    expect(source).toContain("dashboard: 'Overview', members: 'Members', partners: 'Partners', support: 'Support', roles: 'Roles'");
    expect(source).toContain("get('#admin-title').textContent = titles[panel]");
    expect(styles).toContain('.sf-admin-directory #admin-member-directory>button.is-selected{padding-left:1rem');
    expect(styles).toContain('.sf-directory-entry{min-height:4.5rem;margin:.5rem 1rem;padding:.75rem 1rem;border:0');
    expect(source).not.toContain('Platform overview');
    expect(source).toContain('<p class="sf-kicker">4 accounts</p>');
    expect(source).toContain('<p class="sf-kicker">4 studios</p>');
    expect(source).toContain("if (adminGuideStep === 2) { adminGuideStep = 0; showStudioGuide('Overview updated'");
  });

  it('marks the selected workspace tab with the same accessible active state', () => {
    expect(source).toContain("button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current')");
    expect(source).toContain("if (button.dataset.partnerTab === panel) button.setAttribute('aria-current', 'page')");
    expect(styles).toContain('.sf-member-nav button[aria-current=page]{color:var(--night);background:var(--cyan)}');
    expect(styles).toContain('.sf-partner-nav button[aria-current="page"]{color:var(--night);background:var(--pink)}');
    expect(styles).toContain('.sf-demo-dock-panel .sf-mode-switch button[aria-pressed=true]');
  });

  it('gives Partner task-focused tabs and keeps member records scoped to studio bookings', () => {
    const dom = new JSDOM(built);
    const document = dom.window.document;
    expect(document.querySelector('nav[aria-label="Partner workspace"]')).not.toBeNull();
    expect(document.querySelector('[data-partner-tab="classes"][aria-current="page"]')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="members"]')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="staff"]')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="classes"] #open-class-dialog')?.textContent?.trim()).toBe('Add class');
    expect(document.querySelector('[data-partner-panel="members"] #open-class-dialog')).toBeNull();
    expect(document.querySelector('[data-partner-panel="staff"] #open-class-dialog')).toBeNull();
    expect(document.querySelector('#partner-member-search')?.getAttribute('type')).toBe('search');
    expect(document.querySelector('#partner-member-status option[value="pending"]')?.textContent).toBe('Pending approval');
    expect(document.querySelector('#partner-member-status option[value="confirmed"]')).toBeNull();
    expect(source).toContain("`${name} ${classes.map((session) => session.name).join(' ')}`.toLowerCase().includes(query)");
    expect(source).toContain("status !== 'pending' || pendingMembers.has(name)");
    expect(document.querySelector('[data-view-panel="schedule"] #schedule-title')?.textContent).toBe('Schedule');
    expect(document.querySelectorAll('.sf-desk-date')).toHaveLength(0);
    expect(styles).toContain('.sf-view .sf-desk-heading{width:min(100%,76rem);margin:0 auto var(--set-space-4)}');
    expect(styles).toContain('.sf-studio-grid{width:min(100%,76rem);margin-inline:auto}');
    expect(styles).not.toContain('.sf-view[data-view-panel="schedule"] .sf-desk-heading{display:none}');
    expect(document.querySelector('[data-partner-panel="classes"] #partner-calendar')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="classes"] [data-partner-week="previous"]')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="classes"] [data-partner-week="next"]')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-period')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-bookings')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-fill')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-waitlist')).not.toBeNull();
    expect(source).toContain("partnerWeekOffset += button.dataset.partnerWeek === 'next' ? 1 : -1");
    expect(source).toContain("if (row) row.hidden = weekdayFor(session) !== activeDay");
    expect(source).toContain("const multiplier = period === 'month' ? 4 : 1");
    expect(source).toContain("sessions.filter((session) => session.studio === partnerStudio && session.status !== 'cancelled')");
    expect(source).toContain("get<HTMLAnchorElement>('#set-home').href = url.href");
    expect(source).toContain("if (mode === 'studio') { setView('studio'); setPartnerPanel('classes'); get('#studio-title').focus(); }");
    expect(source).toContain("else { setView('admin'); setAdminPanel('dashboard'); get('#admin-title').focus(); }");
  });

  it('renders role-specific workspace landmarks and polite action feedback', () => {
    const dom = new JSDOM(built);
    const document = dom.window.document;
    expect(document.querySelector('nav[aria-label="Member workspace"]')).not.toBeNull();
    expect(document.querySelector('nav[aria-label="Admin workspace"]')).not.toBeNull();
    expect(document.querySelector('[data-view-panel="studio"]')).not.toBeNull();
    expect(document.querySelector('[role="status"][aria-live="polite"]')).not.toBeNull();
  });

  it('keeps other confirmed bookings when cancelling one class', () => {
    expect(source).toContain("const remaining = bookings.filter((item) => item.status === 'confirmed')");
    expect(source).toContain('removeEnrollment(bookings, session.id, demoMemberName, credits, returned)');
    expect(source).toContain('cancelSessionEnrollments(bookings, session.id, credits, refundEligible(session))');
  });

  it('asks waitlisted members to accept instead of silently booking them', () => {
    expect(source).toContain('you’ll get 24 hours to accept. Credits are used only if you accept.');
    expect(source).toContain("label: 'Waitlist offer · Form House'");
    expect(source).not.toContain('auto-enrollment enabled');
  });

  it('keeps shared header icons borderless and aligned on desktop', () => {
    expect(styles).toContain('.sf-notifications-button,.sf-dialog-close{border:0;box-shadow:none}');
    expect(styles).toContain('.sf-tour-sheet .sf-tour-minimize:hover,.sf-tour-sheet .sf-tour-close:hover{background:transparent}');
    expect(styles).toContain('.sf-notifications-button:hover,.sf-notifications-button[aria-expanded="true"]{background:transparent}');
    expect(styles).toContain('.sf-notifications-panel{top:6.75rem}');
  });

  it('keeps phone cards readable and overlays clear of primary controls', () => {
    expect(styles).toContain('.sf-class-card::before{display:none}');
    expect(styles).toContain('.sf-class-card .sf-class-record strong{font-size:.95rem;line-height:1.15;overflow-wrap:anywhere}');
    expect(styles).toContain('.sf-notifications-panel{top:8rem');
    expect(styles).toContain('.sf-tour-sheet{right:.5rem;bottom:calc(3.75rem + env(safe-area-inset-bottom))');
    expect(source).toContain('setGuideMinimized(false)');
    expect(styles).toContain('.sf-demo-dock{position:absolute;top:.45rem;right:.5rem');
    expect(styles).toContain('body.has-active-tour .sf-view{padding-bottom:calc(19rem + env(safe-area-inset-bottom))}');
  });
});
