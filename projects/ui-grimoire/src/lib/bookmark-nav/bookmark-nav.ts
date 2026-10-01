import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon, type IconName } from '../icon/icon';
import { medallionInitial } from '../medallion/medallion';

/**
 * One navigation entry, shared by BookmarkNav and BookmarkTabs (BookmarkNavItem in index.d.ts).
 * An entry leads to a page: it is a link to `link`; a `divider` separates groups.
 */
export interface BookmarkNavItem {
  id: string;
  label?: string;
  /** Destination, as given to `routerLink`. */
  link?: string;
  icon?: IconName;
  /** Quests in progress, for example. */
  count?: number;
  divider?: boolean;
}

export type BookmarkNavVariant = 'full' | 'rail';

/** Initial of the campaign for the rail seal: leading article skipped, accent removed (« L'Âge » → « A »). */
export function campaignInitial(title: string): string {
  return medallionInitial(title).normalize('NFD').charAt(0);
}

/**
 * Vertical page navigation: each entry a ribbon bookmark coming out of the spine; the
 * active one, in crimson, reaches furthest. `full` on desktop, `rail` (88px, icon above a
 * short label) on tablet. Entries are links; the active one gets `aria-current="page"`.
 */
@Component({
  selector: 'nav[grBookmarkNav]',
  imports: [Icon, RouterLink, RouterLinkActive],
  host: {
    '[class]': 'classes()',
    '[attr.aria-label]': 'ariaLabel()',
    // `title` is an input: never leave it as a tooltip on the whole navigation.
    '[attr.title]': 'null',
  },
  template: `
    @if (title(); as t) {
      <div class="gr-bnav__head" [attr.title]="rail() ? t : null">
        @if (rail()) {
          <div class="gr-bnav__mono" aria-hidden="true">{{ initial() }}</div>
          <span class="gr-sr">{{ t }}</span>
        } @else {
          @if (kicker()) {
            <div class="gr-bnav__kicker">{{ kicker() }}</div>
          }
          <div class="gr-bnav__title">{{ t }}</div>
        }
      </div>
    }
    <ul class="gr-bnav__list">
      @for (item of items(); track item.id) {
        @if (item.divider) {
          <li class="gr-bnav__divider" role="separator"></li>
        } @else {
          <li class="gr-bnav__item">
            <a
              class="gr-bnav__ribbon"
              [routerLink]="item.link"
              routerLinkActive="gr-bnav__ribbon--on"
              ariaCurrentWhenActive="page"
            >
              @if (item.icon) {
                <span class="gr-bnav__icon" aria-hidden="true"
                  ><gr-icon [name]="item.icon" [size]="16"
                /></span>
              }
              <span class="gr-bnav__label">{{ item.label }}</span>
              @if (item.count != null) {
                @if (rail()) {
                  <span class="gr-bnav__count"
                    ><span aria-hidden="true">{{ item.count }}</span
                    ><span class="gr-sr">, {{ item.count }}</span></span
                  >
                } @else {
                  <span class="gr-bnav__count">{{ item.count }}</span>
                }
              }
            </a>
          </li>
        }
      }
    </ul>
    @if (footer() && !rail()) {
      <div class="gr-bnav__foot">{{ footer() }}</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkNav {
  readonly items = input.required<readonly BookmarkNavItem[]>();
  /** `full` (desktop ≥ 1200px) or `rail` (tablet 768–1199px; icons become mandatory). */
  readonly variant = input<BookmarkNavVariant>('full');
  /** Campaign name shown at the top (a gold seal with its initial in the rail). */
  readonly title = input<string>();
  readonly kicker = input<string>();
  /** Current session or signed-in player; hidden in the rail. */
  readonly footer = input<string>();
  readonly ariaLabel = input('Navigation principale', { alias: 'aria-label' });

  protected readonly rail = computed(() => this.variant() === 'rail');
  protected readonly initial = computed(() => campaignInitial(this.title() ?? ''));
  protected readonly classes = computed(() => (this.rail() ? 'gr-bnav gr-bnav--rail' : 'gr-bnav'));
}
