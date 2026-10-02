import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY } from '@scriptorium/ui-grimoire';
import { Settings } from './settings';

describe('Settings', () => {
  beforeEach(() => localStorage.removeItem(THEME_STORAGE_KEY));
  afterEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    delete document.documentElement.dataset['theme'];
  });

  async function render() {
    const fixture = TestBed.createComponent(Settings);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      el,
      button: el.querySelector('button')!,
      current: () => el.querySelector('.settings__text strong')!.textContent,
    };
  }

  it('is the Réglages page, with a theme section', async () => {
    const { el } = await render();
    expect(el.querySelector('h1')?.textContent).toBe('Réglages');
    const heading = el.querySelector('h2')!;
    expect(heading.textContent).toBe('Thème');
    expect(el.querySelector('section')?.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('switches between Parchemin and Donjon, and remembers it', async () => {
    const { fixture, button, current } = await render();
    expect(button.className).toBe('gr-btn gr-btn--secondary');
    expect(document.documentElement.dataset['theme']).toBe('parchment');
    expect(current()).toBe('Parchemin');
    expect(button.textContent!.trim()).toBe('Passer au thème Donjon');

    button.click();
    await fixture.whenStable();
    expect(document.documentElement.dataset['theme']).toBe('dungeon');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dungeon');
    expect(current()).toBe('Donjon');
    expect(button.textContent!.trim()).toBe('Passer au thème Parchemin');

    button.click();
    await fixture.whenStable();
    expect(document.documentElement.dataset['theme']).toBe('parchment');
    expect(current()).toBe('Parchemin');
  });
});
