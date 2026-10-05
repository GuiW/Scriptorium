import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestsStore } from '@scriptorium/feature-quests/data';
import {
  BookmarkNav,
  BookmarkTabs,
  injectLayout,
  type BookmarkNavItem,
} from '@scriptorium/ui-grimoire';
import { MOBILE_NAV, NAV_ORDER, PAGES, type PageId } from '../pages';

/** The one campaign of the mock data (design/quetes). */
export const CAMPAIGN = { title: "L'Âge des Cendres", session: 'Session XIV · 12 septembre' };

/**
 * Application frame: the page navigation for the current layout (BookmarkNav full on desktop,
 * rail on tablet, BookmarkTabs at the bottom on mobile) around the routed page.
 */
@Component({
  selector: 'app-shell',
  imports: [BookmarkNav, BookmarkTabs, RouterOutlet],
  host: { class: 'shell', '[class.shell--mobile]': "layout() === 'mobile'" },
  template: `@if (layout() === 'mobile') {
      <main class="shell__page"><router-outlet /></main>
      <nav grBookmarkTabs class="shell__tabs" [items]="mobileItems()"></nav>
    } @else {
      <nav
        grBookmarkNav
        class="shell__nav"
        [variant]="layout() === 'desktop' ? 'full' : 'rail'"
        kicker="Campagne"
        [title]="campaign.title"
        [footer]="campaign.session"
        [items]="items()"
      ></nav>
      <main class="shell__page"><router-outlet /></main>
    }`,
  styleUrl: './shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  protected readonly layout = injectLayout();
  protected readonly campaign = CAMPAIGN;
  private readonly quests = inject(QuestsStore);

  /** The bookmarks, from the PAGES table; Quêtes counts the quests in progress. */
  protected readonly items = computed<BookmarkNavItem[]>(() =>
    NAV_ORDER.map((entry, i) => {
      if (entry === 'divider') return { id: `divider-${i}`, divider: true };
      const { path, label, icon } = PAGES[entry];
      return {
        id: entry,
        label,
        icon,
        link: `/${path}`,
        count: entry === 'quests' ? this.quests.counts().active : undefined,
      };
    }),
  );
  protected readonly mobileItems = computed(() =>
    this.items().filter((item) => MOBILE_NAV.includes(item.id as PageId)),
  );
}
