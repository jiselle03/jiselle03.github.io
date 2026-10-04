import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/pages/demo/studio.astro'), 'utf8');
const built = readFileSync(resolve(root, 'dist/demo/studio/index.html'), 'utf8');

describe('Set demo role shell', () => {
  it('keeps account access in the signed-in identity control', () => {
    const dom = new JSDOM(built);
    expect(dom.window.document.querySelector('#signed-in-identity')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-view="account"]')).toBeNull();
    expect(dom.window.document.querySelector('[data-account-content="member"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-account-content="studio"]')).not.toBeNull();
    expect(dom.window.document.querySelector('[data-account-content="admin"]')).not.toBeNull();
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
});
