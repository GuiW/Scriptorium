import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BADGE_TONES, Badge, type BadgeTone } from './badge';

@Component({
  imports: [Badge],
  template: `<div [attr.data-theme]="theme()">
    @if (content()) {
      <gr-badge [tone]="tone()" [glyph]="glyph()">{{ content() }}</gr-badge>
    } @else {
      <gr-badge [tone]="tone()" [glyph]="glyph()" />
    }
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly tone = input<BadgeTone>('active');
  readonly glyph = input<string | false>();
  readonly content = input<string>();
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const badge = (fixture.nativeElement as HTMLElement).querySelector('gr-badge');
  if (!badge) throw new Error('no badge rendered');
  const glyph = badge.querySelector('.gr-badge__glyph');
  return { badge, glyph, label: badge.textContent!.replace(glyph?.textContent ?? '', '').trim() };
}

describe('Badge', () => {
  it('renders each tone with its class, glyph and French label', async () => {
    for (const [tone, { glyph, label }] of Object.entries(BADGE_TONES)) {
      const r = await render({ tone });
      expect(r.badge.className, tone).toBe(`gr-badge gr-badge--${tone}`);
      expect(r.glyph?.textContent, tone).toBe(glyph);
      expect(r.glyph?.getAttribute('aria-hidden'), tone).toBe('true');
      expect(r.label, tone).toBe(label);
    }
  });

  it('defaults to the active tone', async () => {
    const r = await render();
    expect(r.badge.classList.contains('gr-badge--active')).toBe(true);
    expect(r.label).toBe('En cours');
  });

  it('lets projected content replace the label', async () => {
    const r = await render({ tone: 'reward', content: '250 po' });
    expect(r.glyph?.textContent).toBe('✦');
    expect(r.label).toBe('250 po');
  });

  it('accepts a custom glyph', async () => {
    const r = await render({ tone: 'urgent', glyph: '⌛' });
    expect(r.glyph?.textContent).toBe('⌛');
  });

  it('hides the glyph when glyph is false', async () => {
    const r = await render({ tone: 'completed', glyph: false });
    expect(r.glyph).toBeNull();
    expect(r.label).toBe('Accomplie');
  });

  it('presses a new status like a seal, never on the first render', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput('tone', 'active');
    await fixture.whenStable();
    const badge = (fixture.nativeElement as HTMLElement).querySelector('gr-badge')!;
    expect(badge.classList.contains('gr-badge--stamp')).toBe(false);

    fixture.componentRef.setInput('tone', 'completed');
    await fixture.whenStable();
    expect(badge.className).toBe('gr-badge gr-badge--completed gr-badge--stamp');
    badge.dispatchEvent(new Event('animationend'));
    await fixture.whenStable();
    expect(badge.className).toBe('gr-badge gr-badge--completed');
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ tone: 'failed' });
    const dark = await render({ tone: 'failed', theme: 'dungeon' });
    expect(dark.badge.outerHTML).toBe(light.badge.outerHTML);
  });
});
