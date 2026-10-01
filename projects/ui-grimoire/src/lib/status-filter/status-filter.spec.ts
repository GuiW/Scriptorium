import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StatusFilter, type StatusFilterItem } from './status-filter';

const ITEMS: StatusFilterItem[] = [
  { id: 'active', label: 'En cours', count: 3 },
  { id: 'completed', label: 'Accomplies', count: 1 },
  { id: 'failed', label: 'Échouées', count: 0 },
  { id: 'rumor', label: 'Rumeurs' },
];

@Component({
  imports: [StatusFilter],
  template: `<div [attr.data-theme]="theme()">
    <gr-status-filter
      [items]="items()"
      [(value)]="value"
      aria-label="Filtrer les quêtes"
      controls="quest-list"
    />
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly items = signal(ITEMS);
  readonly value = signal<string | undefined>('active');
}

const KEY_CODES: Record<string, number> = { ArrowLeft: 37, ArrowRight: 39, Home: 36, End: 35 };

async function render(inputs: Partial<Record<'theme', unknown>> = {}, value?: string) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, v] of Object.entries(inputs)) fixture.componentRef.setInput(key, v);
  if (value !== undefined) fixture.componentInstance.value.set(value);
  await fixture.whenStable();
  const group = (fixture.nativeElement as HTMLElement).querySelector('gr-status-filter');
  if (!group) throw new Error('no status filter rendered');
  const options = () => [...group.querySelectorAll<HTMLButtonElement>('button')];
  const key = async (target: HTMLElement, k: string) => {
    // The CDK key manager reads keyCode, which browsers set but synthetic events do not.
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, keyCode: KEY_CODES[k], bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, group, options, key, host: fixture.componentInstance };
}

describe('StatusFilter', () => {
  it('renders a labelled radio group with the gr-tabs classes', async () => {
    const r = await render();
    expect(r.group.classList.contains('gr-tabs')).toBe(true);
    expect(r.group.getAttribute('role')).toBe('radiogroup');
    expect(r.group.getAttribute('aria-label')).toBe('Filtrer les quêtes');
    expect(r.group.getAttribute('aria-controls')).toBe('quest-list');
  });

  it('renders every option with its label and count, including 0', async () => {
    const r = await render();
    const options = r.options();
    expect(options.length).toBe(4);
    for (const [i, item] of ITEMS.entries()) {
      expect(options[i].getAttribute('type')).toBe('button');
      expect(options[i].getAttribute('role')).toBe('radio');
      expect(options[i].querySelector('.gr-tabs__label')?.textContent).toBe(item.label);
      const count = options[i].querySelector('.gr-tabs__count');
      expect(count?.textContent ?? null).toBe(item.count == null ? null : String(item.count));
    }
  });

  it('checks the active option only and makes it the single Tab stop', async () => {
    const r = await render({}, 'completed');
    const states = r.options().map((o) => [
      o.classList.contains('gr-tabs__tab--on'),
      o.getAttribute('aria-checked'),
      o.tabIndex,
    ]);
    expect(states).toEqual([
      [false, 'false', -1],
      [true, 'true', 0],
      [false, 'false', -1],
      [false, 'false', -1],
    ]);
  });

  it('falls back to the first option as the Tab stop without a matching value', async () => {
    const r = await render({}, 'unknown');
    expect(r.options().map((o) => o.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(r.options().every((o) => o.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('selects an option on click', async () => {
    const r = await render();
    r.options()[2].click();
    await r.fixture.whenStable();
    expect(r.host.value()).toBe('failed');
    expect(r.options()[2].getAttribute('aria-checked')).toBe('true');
  });

  it('moves focus and selection with the arrow keys, Home and End, wrapping around', async () => {
    const r = await render();
    r.options()[0].focus();
    await r.key(r.options()[0], 'ArrowRight');
    expect(r.host.value()).toBe('completed');
    expect(document.activeElement).toBe(r.options()[1]);
    await r.key(r.options()[1], 'End');
    expect(r.host.value()).toBe('rumor');
    await r.key(r.options()[3], 'ArrowRight');
    expect(r.host.value()).toBe('active');
    await r.key(r.options()[0], 'ArrowLeft');
    expect(r.host.value()).toBe('rumor');
    await r.key(r.options()[3], 'Home');
    expect(r.host.value()).toBe('active');
    expect(document.activeElement).toBe(r.options()[0]);
  });

  it('starts keyboard moves from an option picked by click or set from outside', async () => {
    const r = await render();
    r.host.value.set('failed');
    await r.fixture.whenStable();
    await r.key(r.options()[2], 'ArrowRight');
    expect(r.host.value()).toBe('rumor');
    r.options()[1].click();
    await r.fixture.whenStable();
    await r.key(r.options()[1], 'ArrowLeft');
    expect(r.host.value()).toBe('active');
  });

  it('positions the sliding underline on the checked option once measured', async () => {
    const r = await render();
    expect(r.group.classList.contains('gr-tabs--slide')).toBe(true);
    const style = (r.group as HTMLElement).style;
    expect(style.getPropertyValue('--gr-tabs-x')).toMatch(/^\d+px$/);
    expect(style.getPropertyValue('--gr-tabs-w')).toMatch(/^\d+px$/);
    const none = await render({}, 'unknown');
    expect(none.group.classList.contains('gr-tabs--slide')).toBe(false);
  });

  it('makes a count jump when it changes, never on the first render', async () => {
    const r = await render();
    const count = (i: number) => r.options()[i].querySelector('.gr-tabs__count')!;
    expect(r.group.querySelectorAll('.gr-bump').length).toBe(0);
    r.host.items.set([
      { id: 'active', label: 'En cours', count: 2 },
      { id: 'completed', label: 'Accomplies', count: 2 },
      { id: 'failed', label: 'Échouées', count: 0 },
      { id: 'rumor', label: 'Rumeurs' },
    ]);
    await r.fixture.whenStable();
    expect([0, 1, 2].map((i) => count(i).classList.contains('gr-bump'))).toEqual([true, true, false]);
    count(0).dispatchEvent(new Event('animationend'));
    await r.fixture.whenStable();
    expect(count(0).classList.contains('gr-bump')).toBe(false);
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render();
    const dark = await render({ theme: 'dungeon' });
    expect(dark.group.outerHTML).toBe(light.group.outerHTML);
  });
});
