import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal, type Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Screen layouts of the mockups (design/quetes: 390, 1024 and 1440px). Mobile: BookmarkTabs;
 * tablet: BookmarkNav rail, the quest detail is a page; desktop: BookmarkNav full, the detail
 * is a side panel.
 */
export type Layout = 'mobile' | 'tablet' | 'desktop';

/**
 * Minimum widths of the tablet and desktop layouts (design/grimoire/README.md, Navigation). The
 * only place they are written: styles follow the `data-layout` attribute, not a media query.
 */
export const LAYOUT_MIN_WIDTH = { tablet: 768, desktop: 1200 } as const;

const TABLET = `(min-width: ${LAYOUT_MIN_WIDTH.tablet}px)`;
const DESKTOP = `(min-width: ${LAYOUT_MIN_WIDTH.desktop}px)`;

/**
 * Current layout, from the viewport width. It is also set as the `data-layout` attribute on
 * `<html>` (as ThemeService sets `data-theme`), so CSS follows the very same decision:
 * `:root[data-layout='mobile']`, `:host-context([data-layout='mobile'])`.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly observer = inject(BreakpointObserver);
  private readonly current = signal<Layout>(this.measure());

  readonly layout = this.current.asReadonly();

  constructor() {
    this.apply(this.current());
    this.observer
      .observe([TABLET, DESKTOP])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.apply(this.measure()));
  }

  private measure(): Layout {
    if (this.observer.isMatched(DESKTOP)) return 'desktop';
    return this.observer.isMatched(TABLET) ? 'tablet' : 'mobile';
  }

  private apply(layout: Layout): void {
    this.current.set(layout);
    // Applied right away, without waiting for change detection: styles never lag behind.
    this.root.dataset['layout'] = layout;
  }
}

/** Current layout as a signal; call it in an injection context (a field initialiser). */
export function injectLayout(): Signal<Layout> {
  return inject(LayoutService).layout;
}
