import type { IconName } from '../icon/icon';
import type { Rarity, Reward, RewardKind, VisibilityLevel, VisibilityValue } from './types';

/** Rarities from the most common to the rarest. */
export const RARITIES: readonly Rarity[] = ['common', 'uncommon', 'rare', 'unique'];

/** French rarity words (RARITY in design/grimoire/components/bundle.js). */
export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Courant',
  uncommon: 'Peu courant',
  rare: 'Rare',
  unique: 'Unique',
};

/** Icon of each reward kind (REWARD_ICON in bundle.js). */
export const REWARD_ICONS: Record<RewardKind, IconName> = {
  coin: 'pieces',
  xp: 'xp',
  item: 'butin',
  reputation: 'faction',
  other: 'quete',
};

/** Visibility levels from the widest to the most restricted. */
const VISIBILITY_RANK: Record<VisibilityLevel, number> = { table: 0, players: 1, gm: 2 };

/**
 * Rewards that everyone who sees the quest also sees: those more restricted than the quest
 * (a Secret MJ item on a public quest) are left out. A summary has no room for their
 * Visibility marker; they show, marked, in the full RewardList.
 */
export function rewardsWithin(
  rewards: readonly Reward[],
  quest?: VisibilityValue,
): readonly Reward[] {
  const limit = VISIBILITY_RANK[quest?.level ?? 'table'];
  return rewards.filter((r) => VISIBILITY_RANK[r.visibility?.level ?? 'table'] <= limit);
}
