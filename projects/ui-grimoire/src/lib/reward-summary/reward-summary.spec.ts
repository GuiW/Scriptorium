import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Reward } from '../shared/types';
import { RewardSummary } from './reward-summary';

@Component({
  imports: [RewardSummary],
  template: `<div [attr.data-theme]="theme()"><gr-reward-summary [rewards]="rewards()" /></div>`,
})
class Host {
  readonly theme = input<string>();
  readonly rewards = input<Reward[]>([]);
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const sum = (fixture.nativeElement as HTMLElement).querySelector('gr-reward-summary');
  if (!sum) throw new Error('no summary rendered');
  return {
    sum,
    badge: sum.querySelector('gr-badge'),
    items: sum.querySelector('.gr-rsum__items'),
    more: sum.querySelector('.gr-rsum__more'),
  };
}

/** Q1 of the canvas: coins, XP, a rare and an uncommon item. */
const Q1: Reward[] = [
  { kind: 'coin', label: '250 po' },
  { kind: 'xp', label: '80 XP' },
  { kind: 'item', label: 'Lame de lune', rarity: 'rare', note: 'épée longue +1' },
  { kind: 'item', label: 'Potion de guérison moyenne', rarity: 'uncommon' },
];

describe('RewardSummary', () => {
  it('shows coins and XP as one reward badge and counts items in the rarest colour', async () => {
    const r = await render({ rewards: Q1 });
    expect(r.sum.className).toBe('gr-rsum');
    expect(r.badge?.className).toBe('gr-badge gr-badge--reward');
    expect(r.badge?.querySelector('.gr-badge__glyph')?.textContent).toBe('✦');
    expect(r.badge?.textContent?.replace('✦', '').trim()).toBe('250 po · 80 XP');
    // Class order is not meaningful: Angular's class interpolation may reorder it.
    expect([...r.items!.classList].sort()).toEqual(['gr-rarity--rare', 'gr-rsum__items']);
    expect(r.items?.textContent?.trim()).toBe('2 objets');
    expect(r.items?.getAttribute('title')).toBe('Lame de lune, Potion de guérison moyenne');
    expect(r.items?.querySelector('gr-icon svg')?.getAttribute('width')).toBe('14');
    expect(r.more).toBeNull();
  });

  it('counts a single item and defaults its rarity to common', async () => {
    const r = await render({ rewards: [{ kind: 'item', label: 'Corde en soie' }] });
    expect(r.items?.textContent?.trim()).toBe('1 objet');
    expect(r.items?.classList.contains('gr-rarity--common')).toBe(true);
    expect(r.badge).toBeNull();
  });

  it('picks unique over every other rarity', async () => {
    const rewards: Reward[] = [
      { kind: 'item', label: 'A', rarity: 'uncommon' },
      { kind: 'item', label: 'B', rarity: 'unique' },
      { kind: 'item', label: 'C', rarity: 'rare' },
    ];
    expect((await render({ rewards })).items?.classList.contains('gr-rarity--unique')).toBe(true);
  });

  it('counts reputation and other rewards as « +N »', async () => {
    const r = await render({
      rewards: [
        { kind: 'coin', label: '500 po' },
        { kind: 'reputation', label: 'Chevaliers de Lastwall +2' },
        { kind: 'other', label: 'Un repas chez les Emberlyn' },
      ],
    });
    expect(r.badge?.textContent).toContain('500 po');
    expect(r.items).toBeNull();
    expect(r.more?.textContent).toBe('+2');
  });

  it('renders nothing inside without rewards', async () => {
    const r = await render();
    expect(r.sum.children.length).toBe(0);
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ rewards: Q1 });
    const dark = await render({ rewards: Q1, theme: 'dungeon' });
    expect(dark.sum.outerHTML).toBe(light.sum.outerHTML);
  });
});
