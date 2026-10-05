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
    expect(source).toContain("if (isPartner) showStudioGuide('Step 1 of 2 · Add a class'");
    expect(source).toContain("if (mode === 'admin') { selectedAdminMember = 'alex'");
    expect(source).not.toContain("const briefId = isPartner ? '#studio-brief'");
    expect(source).toContain('Explore on my own');
    expect(source).toContain("if (event.key !== 'Escape') return");
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

  it('keeps admin partner records separate from member support actions', () => {
    expect(source).toContain("get('#admin-record-kicker').textContent = members ? 'Selected member' : 'Selected partner'");
    expect(source).toContain("get('#admin-member-name').textContent = 'Form House'");
    expect(source).toContain("get<HTMLButtonElement>('#admin-credit-adjust').hidden = !members");
  });

  it('moves the booking guide away from the control it describes', () => {
    expect(source).toContain("target === '#booking-button'");
    expect(source).toContain('is-booking-guide');
  });

  it('defines separate notification copy for each role', () => {
    expect(source).toContain('Approval needed · Form House');
    expect(source).toContain('Approval received · Nina Hsu');
    expect(source).toContain('Approval pending · Alex Park');
    expect(source).toContain('notificationsButton.addEventListener');
    expect(source).toContain("label: 'Booking removed · Form House'");
    expect(source).toContain("${isMemberBooking ? 'Remove from roster' : 'Unenroll'}");
  });

  it('keeps shared header icons borderless and aligned on desktop', () => {
    expect(styles).toContain('.sf-notifications-button,.sf-dialog-close{border:0;box-shadow:none}');
    expect(styles).toContain('.sf-tour-sheet .sf-tour-minimize:hover,.sf-tour-sheet .sf-tour-close:hover{background:transparent}');
    expect(styles).toContain('.sf-notifications-button:hover,.sf-notifications-button[aria-expanded="true"]{background:transparent}');
    expect(styles).toContain('.sf-notifications-panel{top:6.75rem}');
    expect(styles).toContain('.sf-notifications-panel{top:12.5rem}');
  });
});
