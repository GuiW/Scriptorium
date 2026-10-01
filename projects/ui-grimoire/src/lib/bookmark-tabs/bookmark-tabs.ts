import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { BookmarkNavItem } from '../bookmark-nav/bookmark-nav';
import { Icon } from '../icon/icon';

/** Mobile bar: at most this many entries (dividers ignored). */
export const BOOKMARK_TABS_MAX = 5;

/**
 * Mobile (< 768px) bottom tab bar, with the same items as BookmarkNav: the active tab's
 * crimson ribbon hangs from the top edge. Entries are links; a count becomes an ember dot
 * (the number is read out to screen readers). Pin it to the bottom of the screen.
 */
@Component({
  // On the native nav element to keep its semantics; the gr prefix is still enforced by review.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nav[grBookmarkTabs]',
  imports: [Icon, RouterLink, RouterLinkActive],
  host: { class: 'gr-btabs', '[attr.aria-label]': 'ariaLabel()' },
  template: `<ul class="gr-btabs__list">
    @for (item of tabs(); track item.id) {
      <li class="gr-btabs__item">
        <a
          class="gr-btabs__tab"
          [routerLink]="item.link"
          routerLinkActive="gr-btabs__tab--on"
          ariaCurrentWhenActive="page"
        >
          <span class="gr-btabs__ribbon" aria-hidden="true">
            <span class="gr-btabs__icon">
              @if (item.icon) {
                <gr-icon [name]="item.icon" [size]="16" />
              } @else {
                ◆
              }
            </span>
            @if (item.count) {
              <span class="gr-btabs__dot"></span>
            }
          </span>
          <span class="gr-btabs__label">{{ item.label }}</span>
          @if (item.count) {
            <span class="gr-sr">, {{ item.count }}</span>
          }
        </a>
      </li>
    }
  </ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkTabs {
  readonly items = input.required<readonly BookmarkNavItem[]>();
  readonly ariaLabel = input('Navigation principale', { alias: 'aria-label' });

  protected readonly tabs = computed(() =>
    this.items()
      .filter((item) => !item.divider)
      .slice(0, BOOKMARK_TABS_MAX),
  );
}
