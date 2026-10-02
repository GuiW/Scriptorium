import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/**
 * Screen layouts of the mockups (design/quetes: 390, 1024 and 1440px). Mobile: BookmarkTabs;
 * tablet: BookmarkNav rail, the quest detail is a page; desktop: BookmarkNav full, the detail
 * is a side panel.
 */
export type Layout = 'mobile' | 'tablet' | 'desktop';

/**
 * Minimum widths of the tablet and desktop layouts (design/grimoire/README.md, Navigation). A media
 * query cannot read a CSS variable: component styles repeat these two values.
 */
export const LAYOUT_MIN_WIDTH = { tablet: 768, desktop: 1200 } as const;

const TABLET = `(min-width: ${LAYOUT_MIN_WIDTH.tablet}px)`;
const DESKTOP = `(min-width: ${LAYOUT_MIN_WIDTH.desktop}px)`;

/** Current layout as a signal; call it in an injection context (a field initialiser). */
export function injectLayout(): Signal<Layout> {
  const observer = inject(BreakpointObserver);
  const current = (): Layout =>
    observer.isMatched(DESKTOP) ? 'desktop' : observer.isMatched(TABLET) ? 'tablet' : 'mobile';
  return toSignal(observer.observe([TABLET, DESKTOP]).pipe(map(current)), {
    initialValue: current(),
  });
}
