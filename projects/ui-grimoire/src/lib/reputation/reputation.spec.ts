import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ContactKind } from '../shared/types';
import {
  REPUTATION_SCALES,
  REPUTATION_TONES,
  Reputation,
  type ReputationTrend,
} from './reputation';

@Component({
  imports: [Reputation],
  template: `<div [attr.data-theme]="theme()">
    <gr-reputation
      [kind]="kind()"
      [value]="value()"
      [labels]="labels()"
      [trend]="trend()"
      [compact]="compact()"
    />
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly kind = input<ContactKind>('npc');
  readonly value = input<number>();
  readonly labels = input<string[]>();
  readonly trend = input<ReputationTrend>();
  readonly compact = input(false);
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const rep = (fixture.nativeElement as HTMLElement).querySelector('gr-reputation');
  if (!rep) throw new Error('no reputation rendered');
  const steps = [...rep.querySelectorAll('.gr-rep__step')];
  return {
    rep,
    steps,
    on: steps.findIndex((s) => s.classList.contains('gr-rep__step--on')),
    label: rep.querySelector('.gr-rep__label')?.textContent?.trim(),
    trend: rep.querySelector('.gr-rep__trend'),
  };
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

describe('Reputation', () => {
  it('renders every NPC step with its tone, word and accessible label', async () => {
    for (let value = 0; value < 5; value++) {
      const r = await render({ value });
      const label = REPUTATION_SCALES.npc[value];
      expect(classes(r.rep), label).toEqual(
        ['gr-rep', 'gr-rep--slide', `gr-rep--${REPUTATION_TONES[value]}`].sort(),
      );
      expect(r.steps.length).toBe(5);
      expect(r.on, label).toBe(value);
      expect(r.label).toBe(label);
      expect(r.rep.getAttribute('role')).toBe('img');
      expect(r.rep.getAttribute('aria-label')).toBe(`Réputation : ${label} (${value + 1} sur 5)`);
      expect(r.rep.querySelector('.gr-rep__track')?.getAttribute('aria-hidden')).toBe('true');
      expect(r.rep.querySelector('.gr-rep__label')?.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('uses the faction scale', async () => {
    const r = await render({ kind: 'faction', value: 1 });
    expect(r.label).toBe('Méfiant');
    expect(r.rep.classList.contains('gr-rep--cold')).toBe(true);
  });

  it('defaults to the middle step', async () => {
    const r = await render();
    expect(r.on).toBe(2);
    expect(r.label).toBe('Indifférent');
    expect(r.rep.classList.contains('gr-rep--neutral')).toBe(true);
  });

  it('clamps an out-of-range value', async () => {
    expect((await render({ value: 9 })).label).toBe('Serviable');
    expect((await render({ value: -3 })).label).toBe('Hostile');
  });

  it('spreads the tones along a custom scale', async () => {
    const labels = ['Ennemi', 'Hostile', 'Méfiant', 'Neutre', 'Allié', 'Ami', 'Fidèle'];
    const r = await render({ labels, value: 5 });
    expect(r.steps.length).toBe(7);
    expect(r.label).toBe('Ami');
    expect(r.rep.classList.contains('gr-rep--warm')).toBe(true);
    expect(r.rep.getAttribute('aria-label')).toBe('Réputation : Ami (6 sur 7)');
  });

  it('shows a trend and announces it', async () => {
    const up = await render({ value: 3, trend: 'up' });
    expect(up.trend?.textContent).toBe('▲');
    expect(up.trend?.getAttribute('aria-hidden')).toBe('true');
    expect(up.rep.getAttribute('aria-label')).toBe('Réputation : Amical (4 sur 5), en hausse');
    const down = await render({ value: 3, trend: 'down' });
    expect(down.trend?.textContent).toBe('▼');
    expect(down.rep.getAttribute('aria-label')).toBe('Réputation : Amical (4 sur 5), en baisse');
    expect((await render({ value: 3 })).trend).toBeNull();
  });

  it('adds the compact modifier', async () => {
    const r = await render({ compact: true });
    expect(classes(r.rep)).toEqual([
      'gr-rep',
      'gr-rep--compact',
      'gr-rep--neutral',
      'gr-rep--slide',
    ]);
  });

  it('draws one marker over the track, centred on the current step once measured', async () => {
    const r = await render({ value: 3 });
    expect(r.rep.classList.contains('gr-rep--slide')).toBe(true);
    const track = r.rep.querySelector<HTMLElement>('.gr-rep__track')!;
    expect(track.querySelectorAll('.gr-rep__marker').length).toBe(1);
    expect(track.getAttribute('aria-hidden')).toBe('true');
    expect(track.style.getPropertyValue('--gr-rep-x')).toMatch(/^\d+(\.\d+)?px$/);
    // The current step keeps its place under the marker.
    expect(r.on).toBe(3);
  });

  it('pulses the trend arrow when a trend appears, never on the first render', async () => {
    const already = await render({ value: 3, trend: 'up' });
    expect(already.trend?.classList.contains('gr-rep__trend--pulse')).toBe(false);

    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput('value', 3);
    await fixture.whenStable();
    fixture.componentRef.setInput('trend', 'down');
    await fixture.whenStable();
    const arrow = (fixture.nativeElement as HTMLElement).querySelector('.gr-rep__trend')!;
    expect(arrow.classList.contains('gr-rep__trend--pulse')).toBe(true);
    arrow.dispatchEvent(new Event('animationend'));
    await fixture.whenStable();
    expect(arrow.classList.contains('gr-rep__trend--pulse')).toBe(false);
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ value: 4, trend: 'up' });
    const dark = await render({ value: 4, trend: 'up', theme: 'dungeon' });
    expect(dark.rep.outerHTML).toBe(light.rep.outerHTML);
  });
});
