import type { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { QuestsPage } from './quests-page/quests-page';

/**
 * The list and `:questId` under it in one route, so the page is kept (not rebuilt) when a quest
 * opens or closes: the list keeps its place and the focus can go back to the card.
 */
export function questsMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return { consumed: [] };
  if (segments.length === 1) return { consumed: segments, posParams: { questId: segments[0] } };
  return null;
}

/**
 * The feature's routes, relative to wherever the app mounts them; the app also gives the page
 * its title. The page navigates relative to that mount point.
 */
export const QUESTS_ROUTES: Routes = [{ matcher: questsMatcher, component: QuestsPage }];
