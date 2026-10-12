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

const contrastRatio = (foreground: string, background: string) => {
  const luminance = (hex: string) => {
    const channels = hex.slice(1).match(/.{2}/g)!.map((channel) => parseInt(channel, 16) / 255);
    const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const bootDemo = (role: 'member' | 'partner' | 'admin' = 'member', view = '') => {
  const dom = new JSDOM(built, {
    url: `https://set-demo.invalid/demo/studio/${role === 'member' ? '' : `?role=${role}`}${view ? `${role === 'member' ? '?' : '&'}view=${view}` : ''}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.matchMedia = () => ({ matches: false, media: '', onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
  const scriptPath = window.document.querySelector('script[src]')?.getAttribute('src');
  if (!scriptPath) throw new Error('Set demo script was not emitted');
  window.eval(readFileSync(resolve(root, 'dist', scriptPath.replace(/^\//, '')), 'utf8'));
  return dom;
};

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

  it('updates the theme action label to describe the next available theme', () => {
    const dom = bootDemo();
    const button = dom.window.document.querySelector<HTMLButtonElement>('#theme-toggle-account')!;
    expect(button.textContent?.trim()).toBe('Dark theme');
    button.click();
    expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
    expect(button.textContent?.trim()).toBe('Light theme');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    button.click();
    expect(dom.window.document.documentElement.dataset.theme).toBe('light');
    expect(button.textContent?.trim()).toBe('Dark theme');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('lets workspace navigation leave Account for each role', () => {
    const member = bootDemo();
    member.window.document.querySelector<HTMLButtonElement>('#signed-in-identity')!.click();
    member.window.document.querySelector<HTMLButtonElement>('[data-view="schedule"]')!.click();
    expect(member.window.document.querySelector<HTMLElement>('[data-view-panel="schedule"]')!.hidden).toBe(false);
    expect(member.window.document.querySelector<HTMLElement>('[data-view-panel="account"]')!.hidden).toBe(true);

    const partner = bootDemo('partner');
    partner.window.document.querySelector<HTMLButtonElement>('#signed-in-identity')!.click();
    partner.window.document.querySelector<HTMLButtonElement>('[data-partner-tab="members"]')!.click();
    expect(partner.window.document.querySelector<HTMLElement>('[data-view-panel="studio"]')!.hidden).toBe(false);
    expect(partner.window.document.querySelector<HTMLElement>('[data-partner-panel="members"]')!.hidden).toBe(false);

    const admin = bootDemo('admin');
    admin.window.document.querySelector<HTMLButtonElement>('#signed-in-identity')!.click();
    admin.window.document.querySelector<HTMLButtonElement>('[data-admin-panel-target="members"]')!.click();
    expect(admin.window.document.querySelector<HTMLElement>('[data-view-panel="admin"]')!.hidden).toBe(false);
    expect(admin.window.document.querySelector<HTMLElement>('#admin-directory-panel')!.hidden).toBe(false);
    admin.window.document.querySelector<HTMLButtonElement>('[data-admin-panel-target="support"]')!.click();
    admin.window.document.querySelector<HTMLButtonElement>('#signed-in-identity')!.click();
    expect(admin.window.document.querySelector('#account-return')).toBeNull();
    admin.window.document.querySelector<HTMLButtonElement>('[data-admin-panel-target="support"]')!.click();
    expect(admin.window.document.querySelector<HTMLElement>('#admin-support-panel')!.hidden).toBe(false);
    expect(new URL(admin.window.location.href).searchParams.get('view')).toBe('support');
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

  it('keeps every built form control named and every identifier unique', () => {
    const document = new JSDOM(built).window.document;
    const unnamedControls = [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')].filter((control) =>
      control.type !== 'hidden' && !control.labels?.length && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby'),
    );
    const unnamedButtons = [...document.querySelectorAll('button')].filter((button) =>
      !button.textContent?.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby'),
    );
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(unnamedControls.map((control) => control.outerHTML)).toEqual([]);
    expect(unnamedButtons.map((button) => button.outerHTML)).toEqual([]);
    expect(duplicateIds).toEqual([]);
    expect([...document.querySelectorAll('dialog')].every((dialog) => dialog.getAttribute('aria-labelledby') || dialog.getAttribute('aria-label'))).toBe(true);
    expect([...document.images].filter((image) => !image.hasAttribute('alt'))).toEqual([]);
  });

  it('keeps interactive foreground tokens above WCAG AA contrast in both themes', () => {
    const pairs = [
      ['#f3f7ff', '#11131b'], ['#9da7bd', '#11131b'], ['#69bec7', '#11131b'], ['#d57f9f', '#11131b'],
      ['#15171b', '#eef1f3'], ['#646b73', '#eef1f3'], ['#0d6874', '#eef1f3'], ['#a33e61', '#eef1f3'],
      ['#20203a', '#f3f0e8'], ['#586174', '#f3f0e8'], ['#3d5cc8', '#f3f0e8'],
    ];
    expect(Math.min(...pairs.map(([foreground, background]) => contrastRatio(foreground, background)))).toBeGreaterThanOrEqual(4.5);
    expect(styles.match(/html\[data-theme="light"\]\{--night:/g)).toHaveLength(1);
    expect(styles).toContain('.sf-line-chart span{display:block;flex:1;min-height:.5rem;background:var(--pink)}');
    expect(styles).not.toContain('linear-gradient(165deg');
    expect(styles).toContain('.sf-class-card--climbing::before{background-color:#50675b;background-image:none}');
    expect(styles).toContain('.sf-upcoming-art{background-color:#37555b;background-image:none}');
    expect(styles).toContain('button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible,a:focus-visible{outline-color:var(--cyan)}');
    expect(styles).toContain('.sf-app select{appearance:none;padding-right:2.5rem;background-repeat:no-repeat;background-position:right 1rem center');
  });

  it('keeps responsive, focus, reduced-motion, and touch-target rules in the product stylesheet', () => {
    expect(styles).toContain('@media(max-width:720px)');
    expect(styles).toContain('@media(min-width:721px)');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styles).toContain('button:focus-visible');
    expect(styles).toContain('.sf-notifications-button{position:relative;display:grid;width:44px;min-width:44px;min-height:44px');
    expect(styles).toContain('.sf-tour-sheet.is-minimized .sf-tour-minimize{display:grid;width:44px;min-width:44px;min-height:44px');
    expect(styles).toContain('.sf-demo-dock-close{width:44px;min-width:44px;min-height:44px}');
    expect(styles).toContain(':where([hidden]){display:none!important}');
  });

  it('keeps the static demo within a small local-only asset budget', () => {
    const document = new JSDOM(built).window.document;
    const assets = [
      ...[...document.querySelectorAll('script[src]')].map((element) => element.getAttribute('src')),
      ...[...document.querySelectorAll('link[rel="stylesheet"]')].map((element) => element.getAttribute('href')),
    ].filter((path): path is string => Boolean(path));
    const assetBytes = assets.reduce((total, path) => {
      expect(new URL(path, 'https://set-demo.invalid').origin).toBe('https://set-demo.invalid');
      return total + readFileSync(resolve(root, 'dist', path.replace(/^\//, ''))).byteLength;
    }, Buffer.byteLength(built));
    expect(Buffer.byteLength(built)).toBeLessThan(50_000);
    expect(assetBytes).toBeLessThan(210_000);
    expect(source).not.toMatch(/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/);
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
    expect(source).toContain('data-cancel-session="${booking.id}"');
    expect(source).toContain('id="cancellation-dialog"');
    expect(source).toContain("get('#cancellation-confirm').addEventListener");
  });

  it('offers recurring and one-off partner classes and records admin adjustment reasons', () => {
    const dom = new JSDOM(built);
    const document = dom.window.document;
    expect(document.querySelector('#new-class-recurrence option[value="weekly"]')?.textContent).toBe('Weekly series');
    expect(document.querySelector('#new-class-recurrence option[value="once"]')?.textContent).toBe('One-time session');
    expect(document.querySelector('#new-class-date[type="date"]')).not.toBeNull();
    expect(document.querySelector('#admin-credit-reason[required]')).toBeNull();
    expect(document.querySelector('#admin-credit-reason')?.getAttribute('maxlength')).toBe('100');
    expect(source).toContain('adjustCredits(profile.credits, 1, reason,');
    expect(source).toContain('pendingStudioClass.recurrence =');
  });

  it('uses dated occurrence IDs for member decisions, cancellations, and waitlist offers', () => {
    expect(source).toContain('booking.occurrenceId || `${session.id}@${booking.occurrenceDate || occurrenceDateFor(session)}`');
    expect(source).toContain('data-enrollment-id="${item.approvalId}"');
    expect(source).toContain('booking.id === enrollmentId');
    expect(source).toContain('promoteNextWaitlisted(bookings as Enrollment[], `${session.id}@${occurrenceDate}`');
    expect(source).toContain('booking.occurrenceDate === selectedDate');
    expect(source).toContain('!session.cancelledDates?.includes(date)');
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
    expect(source).toContain('Use the calendar controls to find the bouldering intro.');
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
    expect(source).toContain("bookings.push(createScenarioEnrollment(session, 'partner', member))");
    expect(source).toContain("data-enrollment-decision=\"approve\"");
    expect(source).toContain("button.dataset.enrollmentDecision === 'approve' ? 'approve' : 'decline'");
    expect(source).toContain('resolveEnrollmentApproval(bookings as Enrollment[], request.id, decision');
    expect(source).toContain('pendingHoldExpired(booking, now)');
    expect(source).toContain('changeSeats(session, request.occurrenceDate || occurrenceDateFor(session), transition.releasedSeats)');
    expect(source).toContain('partnerNotification = { label: \'Enrollment approved\'');
    expect(readFileSync(resolve(root, 'src/scripts/studio-demo-domain.ts'), 'utf8')).toContain('pendingHoldExpired(request, now)');
  });

  it('starts Admin on the panel containing its guided support action', () => {
    expect(source).toContain("if (mode === 'admin') { get<HTMLElement>('#admin-nav').hidden = false; setAdminPanel('dashboard'); }");
    expect(source).toContain("adjustCredits(profile.credits, 1, reason, 'Priya Shah'");
    expect(source).toContain("setAdminPanel('members'); renderAdmin(); adminGuideStep = 1;");
  });

  it('keeps the Admin attendance chart visible and updates both chart data and text together', () => {
    const document = new JSDOM(built).window.document;
    const attendance = [...document.querySelectorAll<HTMLElement>('.sf-line-chart span')];
    expect(attendance).toHaveLength(7);
    expect(attendance.every((bar) => Number.parseInt(bar.style.height, 10) >= 44)).toBe(true);
    expect(source).toContain("const attendanceHeights = isLong ? [82, 83, 82, 84, 85, 86, 88] : [84, 85, 84, 87, 88, 90, 91]");
    expect(source).toContain("get<HTMLElement>('.sf-line-chart').setAttribute('aria-label'");
    expect(styles).not.toContain('linear-gradient(165deg');
  });

  it('carries a partner hold through member approval into the partner roster and credit balance', () => {
    const { window } = bootDemo('partner');
    const document = window.document;
    document.querySelector<HTMLButtonElement>('[data-partner-day="0"]')?.click();
    document.querySelector<HTMLButtonElement>('[data-manage-session]')?.click();
    expect(document.querySelector<HTMLSelectElement>('#manual-member-select')?.value).toBe('Alex Park');
    document.querySelector<HTMLButtonElement>('#manual-enroll')?.click();
    expect(document.querySelector('#manage-enrollment-list')?.textContent).toContain('approval pending');

    document.querySelector<HTMLButtonElement>('[data-mode="member"]')?.click();
    document.querySelector<HTMLButtonElement>('#notifications-button')?.click();
    expect(document.querySelector('[data-enrollment-decision="approve"]')).not.toBeNull();
    document.querySelector<HTMLButtonElement>('[data-enrollment-decision="approve"]')?.click();
    expect(document.querySelector('#header-credit-balance')?.textContent).toBe('4');

    document.querySelector<HTMLButtonElement>('[data-mode="studio"]')?.click();
    expect(document.querySelector('#studio-roster')?.textContent).toContain('Alex Park');
    expect(document.querySelector('#studio-summary')?.textContent).toContain('7 of 12 seats booked');
    window.close();
  });

  it('loads realistic member examples with consistent dates, credits, approvals, and waitlist state', () => {
    const { window } = bootDemo('member');
    const document = window.document;
    document.querySelector<HTMLButtonElement>('.sf-demo-dock-tab')?.click();
    expect(document.querySelector<HTMLButtonElement>('#load-sample-activity')?.hidden).toBe(false);
    document.querySelector<HTMLButtonElement>('#load-sample-activity')?.click();
    expect(document.querySelector('#header-credit-balance')?.textContent).toBe('4');
    expect(document.querySelector('#schedule-list')?.textContent).toContain('Sunday mobility');

    document.querySelector<HTMLButtonElement>('[data-schedule-day="2"]')?.click();
    expect(document.querySelector('#schedule-list')?.textContent).toContain('Approval pending');
    expect(document.querySelector('#schedule-list')?.textContent).toContain('Reformer flow');
    document.querySelector<HTMLButtonElement>('[data-schedule-day="4"]')?.click();
    expect(document.querySelector('#schedule-list')?.textContent).toContain('Lagree strength');
    expect(document.querySelector('#schedule-list')?.textContent).toContain('Position 1');

    document.querySelector<HTMLButtonElement>('#notifications-button')?.click();
    const approve = document.querySelector<HTMLButtonElement>('[data-enrollment-decision="approve"]');
    expect(approve).not.toBeNull();
    approve?.click();
    expect(document.querySelector('#header-credit-balance')?.textContent).toBe('2');
    document.querySelector<HTMLButtonElement>('[data-mode="studio"]')?.click();
    expect(document.querySelector('#studio-roster')?.textContent).toContain('Alex Park');
    window.close();
  });

  it('walks Admin from the Overview range through a reasoned support credit action', () => {
    const { window } = bootDemo('admin');
    const document = window.document;
    expect(document.querySelector('#admin-title')?.textContent).toBe('Overview');
    expect(document.querySelector('#studio-tour-title')?.textContent).toContain('Step 1 of 3');

    const range = document.querySelector<HTMLSelectElement>('#admin-range')!;
    range.value = '90';
    range.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(document.querySelector('#studio-tour-title')?.textContent).toContain('Step 2 of 3');
    document.querySelector<HTMLButtonElement>('[data-admin-panel-target="members"]')?.click();
    expect(document.querySelector('#studio-tour-title')?.textContent).toContain('Step 3 of 3');
    document.querySelector<HTMLInputElement>('#admin-credit-reason')!.value = 'Courtesy for a missed renewal';
    document.querySelector<HTMLButtonElement>('#admin-credit-adjust')?.click();
    expect(document.querySelector('#admin-support-status')?.textContent).toContain('Reason recorded');
    expect(document.querySelector('#studio-tour-title')?.textContent).toContain('scenario complete');
    window.close();
  });

  it('opens the correct workspace and active destination from a role URL', () => {
    for (const [role, heading, activeTab] of [
      ['member', 'Find your next class', '[data-view="explore"]'],
      ['partner', 'Classes', '[data-partner-tab="classes"]'],
      ['admin', 'Overview', '[data-admin-panel-target="dashboard"]'],
    ] as const) {
      const { window } = bootDemo(role);
      const document = window.document;
      const mode = role === 'partner' ? 'studio' : role;
      expect(document.querySelector(`[data-mode="${mode}"]`)?.getAttribute('aria-pressed')).toBe('true');
      expect([...document.querySelectorAll('[data-view-panel]')].some((panel) => !panel.hasAttribute('hidden') && panel.querySelector('h1')?.textContent === heading)).toBe(true);
      expect(document.querySelector(activeTab)?.getAttribute('aria-current')).toBe('page');
      window.close();
    }
  });

  it('binds scenario restart once and separates closing the partner brief from starting its guide', () => {
    expect(source.match(/get\('#restart-demo-scenario'\)\.addEventListener/g)).toHaveLength(1);
    expect(source.match(/get\('#studio-start'\)\.addEventListener/g)).toHaveLength(2);
    expect(source).toContain("get('#studio-start').addEventListener('click', () => { studioGuideStep = 1;");
  });

  it('uses a section-specific Admin title and gives directory entries breathing room', () => {
    expect(source).toContain("dashboard: 'Overview', members: 'Members', partners: 'Partners', support: 'Support', roles: 'Roles'");
    expect(source).toContain("get('#admin-title').textContent = titles[panel]");
    expect(styles).toContain('.sf-admin-directory #admin-member-directory>button.is-selected{padding-left:1rem');
    expect(styles).toContain('.sf-directory-entry{min-height:4.5rem;margin:.5rem 1rem;padding:.75rem 1rem;border:0');
    expect(source).not.toContain('Platform overview');
    expect(source).toContain('<p class="sf-kicker">4 accounts</p>');
    expect(source).toContain('<p class="sf-kicker">4 studios</p>');
    expect(source).toContain("if (adminGuideStep === 2) { adminGuideStep = 3; showStudioGuide('Step 2 of 3 · Member record'");
    expect(source).toContain('<h2>Case queue</h2>');
    expect(source).not.toContain('<h2>Cases needing review</h2>');
    expect(styles).toContain('.sf-view[data-view-panel="admin"]>.sf-desk-heading{min-height:0;margin-bottom:var(--set-space-4)}');
    expect(styles).toContain('.sf-admin-support-panel{padding:0}');
    expect(styles).toContain('.sf-view[data-view-panel="admin"]>.sf-admin-support-panel .sf-admin-support-head{align-items:flex-start;margin-bottom:var(--set-space-4)}');
    expect(styles).toContain('.sf-role-register{margin-top:0;padding-top:0;border-top:0}');
    expect(styles).toContain('.sf-view[data-view-panel="account"]>.sf-desk-heading>div:first-child{border:0}');
    const document = new JSDOM(built).window.document;
    expect(document.querySelector('#admin-support-panel')?.parentElement?.matches('[data-view-panel="admin"]')).toBe(true);
  });

  it('keeps all role account content on the page heading measure', () => {
    expect(styles).toContain('.sf-view[data-view-panel="account"]>.sf-account-grid,');
    expect(styles).toContain('.sf-view[data-view-panel="account"]>.sf-account-preferences{width:min(100%,76rem);margin-inline:auto}');
    expect(source).not.toContain('id="account-return"');
    expect(styles).toContain('.sf-view>*{max-width:76rem;margin-inline:auto}');
    expect(styles).toContain('.sf-view>.sf-desk-heading{width:min(100%,76rem);height:auto;min-height:0;margin:0 auto var(--set-space-4)}');
  });

  it('restores the active workspace destination from the URL after refresh', () => {
    for (const [role, view, panel] of [
      ['member', 'schedule', '[data-view-panel="schedule"]'],
      ['partner', 'staff', '[data-partner-panel="staff"]'],
      ['admin', 'support', '#admin-support-panel'],
    ] as const) {
      const { window } = bootDemo(role, view);
      expect(window.document.querySelector<HTMLElement>(panel)?.hidden).toBe(false);
      expect(new URL(window.location.href).searchParams.get('view')).toBe(view);
      window.close();
    }
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
    expect(styles).toContain('.sf-view[data-view-panel="admin"]>.sf-admin-panel{width:min(100%,76rem);margin-inline:auto}');
    expect(styles).toContain('.sf-studio-grid{width:min(100%,76rem);margin-inline:auto}');
    expect(styles).toContain('.sf-role-register .sf-register-table{overflow-x:auto');
    expect(styles).toContain('html[data-theme="light"] .sf-role-register .sf-permission-table th,html[data-theme="light"] .sf-role-register .sf-permission-table td{color:#171820}');
    expect(styles).toContain('.sf-role-register .sf-permission-table{min-width:0;table-layout:fixed');
    expect(styles).not.toContain('.sf-view[data-view-panel="schedule"] .sf-desk-heading{display:none}');
    expect(document.querySelector('[data-partner-panel="classes"] #partner-calendar')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="classes"] [data-partner-week="previous"]')).not.toBeNull();
    expect(document.querySelector('[data-partner-panel="classes"] [data-partner-week="next"]')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-period')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-bookings')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-fill')).not.toBeNull();
    expect(document.querySelector('#partner-analytics-waitlist')).not.toBeNull();
    expect(source).toContain("partnerWeekOffset += button.dataset.partnerWeek === 'next' ? 1 : -1");
    expect(source).toContain('const visibleSessions = studioSessions.filter((session) => sessionOccursOnDate(session, selectedDate) || session.cancelledDates?.includes(selectedDate))');
    expect(source).not.toContain('row.hidden = !sessionOccursOnDate(session, partnerSelectedDate)');
    expect(source).toContain("const multiplier = period === 'month' ? 4 : 1");
    expect(source).toContain("sessions.filter((session) => session.studio === partnerStudio && session.status !== 'cancelled')");
    expect(source).toContain("get<HTMLAnchorElement>('#set-home').href = url.href");
    expect(source).toContain("if (mode === 'studio') { setView('studio'); setPartnerPanel('classes'); get('#studio-title').focus(); }");
    expect(source).toContain("else { setView('admin'); setAdminPanel('dashboard'); get('#admin-title').focus(); }");
  });

  it('configures scoped role grants without offering role impersonation', () => {
    const admin = bootDemo('admin', 'roles');
    const adminDoc = admin.window.document;
    expect(adminDoc.querySelector('#admin-role-context')).toBeNull();
    expect(adminDoc.querySelectorAll('[data-platform-permission]')).toHaveLength(10);
    expect(adminDoc.querySelectorAll('.sf-permission-table input:disabled').length).toBeGreaterThanOrEqual(10);
    expect(adminDoc.querySelector('#platform-permission-status')?.textContent?.trim()).toBe('');
    expect(adminDoc.querySelector('#save-platform-permissions')?.textContent?.trim()).toBe('Save');
    const operatorEdit = adminDoc.querySelector<HTMLInputElement>('[data-platform-permission="members-edit"]')!;
    expect(operatorEdit.checked).toBe(false);
    operatorEdit.click();
    expect(operatorEdit.checked).toBe(true);
    expect(adminDoc.querySelector('#platform-permission-status')?.textContent).toBe('Unsaved changes');
    adminDoc.querySelector<HTMLButtonElement>('#save-platform-permissions')!.click();
    expect(adminDoc.querySelector('#platform-permission-status')?.textContent).toContain('Permissions saved');
    adminDoc.querySelector<HTMLButtonElement>('[data-admin-panel-target="support"]')!.click();
    expect(adminDoc.querySelector('#admin-role-context')).toBeNull();
    expect(adminDoc.querySelector('#admin-support-panel label')).toBeNull();

    const partner = bootDemo('partner', 'staff');
    const partnerDoc = partner.window.document;
    expect(partnerDoc.querySelector('#partner-access-preview')).toBeNull();
    expect(partnerDoc.querySelectorAll('[data-partner-permission]')).toHaveLength(8);
    const trainerAttendance = partnerDoc.querySelector<HTMLInputElement>('[data-partner-permission="trainer-attendance"]')!;
    expect(trainerAttendance.checked).toBe(true);
    trainerAttendance.click();
    expect(trainerAttendance.checked).toBe(false);
    expect(partnerDoc.querySelector('#partner-role-status')?.textContent).toContain('Jordan remains signed in as Partner Admin');
    expect(partnerDoc.querySelector('[data-partner-role="Nina Hsu"]')).not.toBeNull();
    partnerDoc.querySelector<HTMLButtonElement>('#restart-demo-scenario')!.click();
    expect(trainerAttendance.checked).toBe(true);
    expect(partnerDoc.querySelector('#partner-role-status')?.textContent).toContain('Changes apply to Form House roles only');
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
    expect(source).toContain("const past = forDay.filter(({ booking }) => booking.status === 'cancelled' || booking.status === 'expired')");
    expect(source).toContain('removeEnrollmentRecord(bookings as Enrollment[], booking.id, credits, returned');
    expect(source).toContain('booking.occurrenceDate === date');
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
