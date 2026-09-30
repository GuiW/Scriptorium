import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { PlayerRef, VisibilityLevel } from '../shared/types';
import { playerNames } from './player-names';
import { Visibility } from './visibility';

@Component({
  imports: [Visibility],
  template: `<div [attr.data-theme]="theme()">
    <gr-visibility
      [level]="level()"
      [players]="players()"
      [compact]="compact()"
      [showPublic]="showPublic()"
    />
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly level = input<VisibilityLevel>('table');
  readonly players = input<PlayerRef[]>([]);
  readonly compact = input(false);
  readonly showPublic = input(false);
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const host = (fixture.nativeElement as HTMLElement).querySelector('gr-visibility');
  if (!host) throw new Error('no visibility rendered');
  const vis = host.querySelector('.gr-vis');
  return {
    host,
    vis,
    text: vis?.textContent?.trim(),
    faces: [...(vis?.querySelectorAll('.gr-vis__face') ?? [])].map((f) => f.textContent?.trim()),
  };
}

const ezren = { name: 'Ezren' };
const kyra = { name: 'Kyra' };
const merisiel = { name: 'Merisiel' };
const valeros = { name: 'Valeros' };

describe('Visibility', () => {
  it('renders nothing for the whole table by default', async () => {
    const r = await render();
    expect(r.vis).toBeNull();
    expect(r.host.textContent?.trim()).toBe('');
  });

  it('shows « Toute la table » when showPublic is set', async () => {
    const r = await render({ showPublic: true });
    expect(r.vis?.className).toBe('gr-vis gr-vis--table');
    expect(r.text).toBe('Toute la table');
  });

  it('marks GM secrets with the broken seal and a word', async () => {
    const r = await render({ level: 'gm' });
    expect(r.vis?.className).toBe('gr-vis gr-vis--gm');
    expect(r.text).toBe('Secret MJ');
    const glyph = r.vis?.querySelector('svg.gr-vis__glyph');
    expect(glyph?.getAttribute('aria-hidden')).toBe('true');
    expect(glyph?.querySelectorAll('path').length).toBe(2);
  });

  it('names the players a content is shared with, faces hidden from assistive technologies', async () => {
    const r = await render({ level: 'players', players: [kyra] });
    expect(r.vis?.className).toBe('gr-vis gr-vis--players');
    expect(r.vis?.querySelector('.gr-vis__faces')?.getAttribute('aria-hidden')).toBe('true');
    expect(r.faces).toEqual(['K']);
    expect(r.text).toBe('KPour Kyra');
    expect(r.vis?.lastElementChild?.textContent).toBe('Pour Kyra');
    expect(r.vis?.getAttribute('title')).toBe('Kyra');
  });

  it('reads « toi » first for the viewer', async () => {
    const r = await render({ level: 'players', players: [kyra, { name: 'Ezren', you: true }] });
    expect(r.vis?.lastElementChild?.textContent).toBe('Pour toi et Kyra');
  });

  it('shortens beyond three names and keeps the full list on hover', async () => {
    const players = [ezren, kyra, merisiel, valeros, { name: 'Amiri' }];
    const r = await render({ level: 'players', players });
    expect(r.vis?.lastElementChild?.textContent).toBe('Pour Ezren, Kyra et +3');
    expect(r.faces).toEqual(['E', 'K', 'M']);
    expect(r.vis?.getAttribute('title')).toBe('Ezren, Kyra, Merisiel, Valeros, Amiri');
  });

  it('drops « Pour » when compact', async () => {
    const r = await render({ level: 'players', players: [ezren, kyra], compact: true });
    expect(r.vis?.lastElementChild?.textContent).toBe('Ezren et Kyra');
  });

  it('renders the same markup under the dungeon theme', async () => {
    for (const level of ['gm', 'players'] as const) {
      const light = await render({ level, players: [kyra] });
      const dark = await render({ level, players: [kyra], theme: 'dungeon' });
      expect(dark.host.outerHTML, level).toBe(light.host.outerHTML);
    }
  });
});

describe('playerNames', () => {
  it('joins names in French', () => {
    expect(playerNames([])).toBe('');
    expect(playerNames([kyra])).toBe('Kyra');
    expect(playerNames([ezren, kyra])).toBe('Ezren et Kyra');
    expect(playerNames([ezren, kyra, merisiel])).toBe('Ezren, Kyra et Merisiel');
    expect(playerNames([ezren, kyra, merisiel, valeros])).toBe('Ezren, Kyra et +2');
    expect(playerNames([{ name: 'Ezren', you: true }])).toBe('toi');
  });
});
