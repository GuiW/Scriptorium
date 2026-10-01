import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ContactKind } from '../shared/types';
import { ContactChip } from './contact-chip';

@Component({
  imports: [ContactChip],
  template: `<div [attr.data-theme]="theme()">
    <gr-contact-chip
      [name]="name()"
      [kind]="kind()"
      [reputation]="reputation()"
      [labels]="labels()"
      [link]="link()"
      (activate)="activations = activations + 1"
    />
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly name = input('Wrin Sivinxi');
  readonly kind = input<ContactKind>('npc');
  readonly reputation = input<number>();
  readonly labels = input<string[]>();
  readonly link = input(false);
  activations = 0;
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const host = (fixture.nativeElement as HTMLElement).querySelector('gr-contact-chip');
  const chip = host?.querySelector<HTMLElement>('.gr-chip');
  if (!host || !chip) throw new Error('no chip rendered');
  return {
    fixture,
    host,
    chip,
    medal: chip.querySelector('gr-medallion'),
    rep: chip.querySelector('.gr-chip__rep'),
  };
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

describe('ContactChip', () => {
  it('renders a plain chip with an xs NPC medallion and the name', async () => {
    const r = await render();
    expect(r.chip.tagName).toBe('SPAN');
    expect(r.chip.className).toBe('gr-chip');
    expect(classes(r.medal!)).toEqual(['gr-medal', 'gr-medal--npc', 'gr-medal--xs']);
    expect(r.chip.querySelector('.gr-chip__name')?.textContent).toBe('Wrin Sivinxi');
    expect(r.rep).toBeNull();
    expect(r.chip.hasAttribute('title')).toBe(false);
  });

  it('uses the faction shield', async () => {
    const r = await render({ name: 'Les Chevaliers de Lastwall', kind: 'faction' });
    expect(r.medal?.classList.contains('gr-medal--faction')).toBe(true);
    expect(r.medal?.textContent?.trim()).toBe('C');
  });

  it('adds the attitude diamond, read out and shown on hover', async () => {
    const r = await render({ reputation: 3 });
    expect(classes(r.rep!)).toEqual(['gr-chip__rep', 'gr-rep--warm']);
    expect(r.rep?.querySelector('.gr-sr')?.textContent).toBe(', Amical');
    expect(r.chip.getAttribute('title')).toBe('Wrin Sivinxi — Amical');
  });

  it('reads the faction scale and clamps an out-of-range step', async () => {
    const faction = await render({ kind: 'faction', reputation: 1 });
    expect(faction.chip.getAttribute('title')).toBe('Wrin Sivinxi — Méfiant');
    const high = await render({ reputation: 12 });
    expect(high.rep?.classList.contains('gr-rep--ally')).toBe(true);
    expect(high.chip.getAttribute('title')).toBe('Wrin Sivinxi — Serviable');
  });

  it('accepts a custom scale', async () => {
    const r = await render({ labels: ['Ennemi', 'Neutre', 'Allié'], reputation: 2 });
    expect(r.rep?.classList.contains('gr-rep--ally')).toBe(true);
    expect(r.rep?.textContent).toBe(', Allié');
  });

  it('becomes a button to the contact card with link', async () => {
    const r = await render({ link: true, reputation: 3 });
    expect(r.chip.tagName).toBe('BUTTON');
    expect(r.chip.getAttribute('type')).toBe('button');
    expect(classes(r.chip)).toEqual(['gr-chip', 'gr-chip--link']);
    r.chip.click();
    expect(r.fixture.componentInstance.activations).toBe(1);
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ reputation: 1, link: true });
    const dark = await render({ reputation: 1, link: true, theme: 'dungeon' });
    expect(dark.host.outerHTML).toBe(light.host.outerHTML);
  });
});
