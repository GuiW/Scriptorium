import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { DEFAULT_THEME, THEMES, type ThemeId } from './color-tokens.generated';

export const THEME_STORAGE_KEY = 'scriptorium.theme';

const isThemeId = (value: unknown): value is ThemeId => THEMES.some((theme) => theme.id === value);

/**
 * Current theme (Parchment or Dungeon). It is set as the `data-theme` attribute on `<html>`, which
 * switches the tokens.css variables, and remembered.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;
  private readonly current = signal<ThemeId>(DEFAULT_THEME);

  readonly themes = THEMES;
  readonly theme = this.current.asReadonly();
  readonly info = computed(() => THEMES.find((t) => t.id === this.current()) ?? THEMES[0]);
  /** The theme `toggle()` switches to. */
  readonly next = computed(() => THEMES[(THEMES.indexOf(this.info()) + 1) % THEMES.length]);

  constructor() {
    this.set(this.stored() ?? DEFAULT_THEME);
  }

  set(theme: ThemeId): void {
    this.current.set(theme);
    // Applied right away, without waiting for change detection: no flash of the previous theme.
    this.root.dataset['theme'] = theme;
    try {
      this.storage?.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable (private browsing, quota): the choice lasts for the session.
    }
  }

  toggle(): void {
    this.set(this.next().id);
  }

  private stored(): ThemeId | null {
    try {
      const value = this.storage?.getItem(THEME_STORAGE_KEY);
      return isThemeId(value) ? value : null;
    } catch {
      return null;
    }
  }
}
