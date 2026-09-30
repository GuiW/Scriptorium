import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ContactKind } from '../shared/types';
import { Medallion, type MedallionSize } from './medallion';

@Component({
  imports: [Medallion],
  template: `<div [attr.data-theme]="theme()">
    <gr-medallion [name]="name()" [kind]="kind()" [size]="size()" [image]="image()" />
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly name = input('Wrin Sivinxi');
  readonly kind = input<ContactKind>('npc');
  readonly size = input<MedallionSize>('md');
  readonly image = input<string>();
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const medal = (fixture.nativeElement as HTMLElement).querySelector('gr-medallion');
  if (!medal) throw new Error('no medallion rendered');
  return medal;
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

describe('Medallion', () => {
  it('renders an NPC seal at the default size, hidden from assistive technologies', async () => {
    const medal = await render();
    expect(classes(medal)).toEqual(['gr-medal', 'gr-medal--md', 'gr-medal--npc']);
    expect(medal.getAttribute('aria-hidden')).toBe('true');
    expect(medal.textContent!.trim()).toBe('W');
  });

  it('renders every kind and size', async () => {
    for (const kind of ['npc', 'faction'] as const) {
      for (const size of ['md', 'xs'] as const) {
        const medal = await render({ kind, size, name: 'Chevaliers de Lastwall' });
        expect(classes(medal)).toEqual(['gr-medal', `gr-medal--${kind}`, `gr-medal--${size}`].sort());
        expect(medal.textContent!.trim()).toBe('C');
      }
    }
  });

  it('skips a leading article for the initial', async () => {
    expect((await render({ name: "L'Ordre du Clou" })).textContent!.trim()).toBe('O');
    expect((await render({ name: 'les Emberlyn' })).textContent!.trim()).toBe('E');
    expect((await render({ name: '  ' })).textContent!.trim()).toBe('?');
  });

  it('shows a decorative portrait instead of the initial', async () => {
    const medal = await render({ image: 'wrin.png' });
    const img = medal.querySelector('img');
    expect(img?.getAttribute('src')).toBe('wrin.png');
    expect(img?.getAttribute('alt')).toBe('');
    expect(medal.textContent!.trim()).toBe('');
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ kind: 'faction' });
    const dark = await render({ kind: 'faction', theme: 'dungeon' });
    expect(dark.outerHTML).toBe(light.outerHTML);
  });
});
