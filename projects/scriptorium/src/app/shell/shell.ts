import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestsStore } from '@scriptorium/feature-quests';
import {
  BookmarkNav,
  BookmarkTabs,
  injectLayout,
  type BookmarkNavItem,
} from '@scriptorium/ui-grimoire';

/** The one campaign of the mock data (design/quetes). */
export const CAMPAIGN = { title: "L'Âge des Cendres", session: 'Session XIV · 12 septembre' };

/**
 * Entries of the mobile tab bar (five at most): those of the mobile mockup, with Réglages in
 * place of « Plus » until that menu exists (design/GAPS.md). Lieux is not in the bar.
 */
const MOBILE_ENTRIES = ['quests', 'journal', 'contacts', 'loot', 'settings'];

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

  protected readonly items = computed<BookmarkNavItem[]>(() => [
    {
      id: 'quests',
      label: 'Quêtes',
      link: '/quetes',
      icon: 'quete',
      count: this.quests.counts().active,
    },
    { id: 'journal', label: 'Journal', link: '/journal', icon: 'journal' },
    { id: 'contacts', label: 'Contacts', link: '/contacts', icon: 'joueurs' },
    { id: 'places', label: 'Lieux', link: '/lieux', icon: 'carte' },
    { id: 'loot', label: 'Butin', link: '/butin', icon: 'butin' },
    { id: 'd1', divider: true },
    { id: 'settings', label: 'Réglages', link: '/reglages', icon: 'reglages' },
  ]);
  protected readonly mobileItems = computed(() =>
    this.items().filter((item) => MOBILE_ENTRIES.includes(item.id)),
  );
}
