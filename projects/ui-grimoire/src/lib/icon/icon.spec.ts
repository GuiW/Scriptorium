import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICON_NAMES, Icon, type IconName } from './icon';

@Component({
  imports: [Icon],
  template: `<div [attr.data-theme]="theme()">
    <gr-icon [name]="name()" [size]="size()" [strokeWidth]="strokeWidth()" [label]="label()" />
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly name = input<IconName>('quete');
  readonly size = input(20);
  readonly strokeWidth = input(1.5);
  readonly label = input<string>();
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
  if (!svg) throw new Error('no svg rendered');
  return svg;
}

describe('Icon', () => {
  it('renders every business name as an svg.gr-icon with Lucide paths', async () => {
    for (const name of ICON_NAMES) {
      const svg = await render({ name });
      expect(svg.classList.contains('gr-icon'), name).toBe(true);
      expect(svg.children.length, name).toBeGreaterThan(0);
    }
  });

  it('uses the Grimoire defaults: 20px, 1.5px stroke, currentColor, round joins', async () => {
    const svg = await render();
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
    expect(svg.getAttribute('stroke-width')).toBe('1.5');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('applies size and strokeWidth', async () => {
    const svg = await render({ size: 16, strokeWidth: 2 });
    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('stroke-width')).toBe('2');
  });

  it('is decorative without a label', async () => {
    const svg = await render();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.hasAttribute('role')).toBe(false);
    expect(svg.hasAttribute('aria-label')).toBe(false);
  });

  it('is an image with an accessible name when labelled', async () => {
    const svg = await render({ label: 'Secret MJ' });
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Secret MJ');
    // Lucide binds aria-hidden as a boolean: "false" here, which keeps the icon exposed.
    expect(svg.getAttribute('aria-hidden')).toBe('false');
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ name: 'secret' });
    const dark = await render({ name: 'secret', theme: 'dungeon' });
    expect(dark.outerHTML).toBe(light.outerHTML);
  });
});
