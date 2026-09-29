import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  const attribute = () => document.documentElement.dataset['theme'];

  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in Parchment and sets the attribute on <html>', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('parchment');
    expect(attribute()).toBe('parchment');
  });

  it('restores the remembered theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dungeon');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dungeon');
    expect(attribute()).toBe('dungeon');
  });

  it('ignores an unknown stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'crypte');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('parchment');
    expect(attribute()).toBe('parchment');
  });

  it('toggles between both themes, updates the attribute and remembers the choice', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.next().id).toBe('dungeon');

    service.toggle();
    expect(service.theme()).toBe('dungeon');
    expect(service.info().name).toBe('Dungeon');
    expect(service.next().name).toBe('Parchment');
    expect(attribute()).toBe('dungeon');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dungeon');

    service.toggle();
    expect(service.theme()).toBe('parchment');
    expect(attribute()).toBe('parchment');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('parchment');
  });

  it('works when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('parchment');

    service.toggle();
    expect(service.theme()).toBe('dungeon');
    expect(attribute()).toBe('dungeon');
  });
});
