import type { IconName } from '../icon/icon';
import type { Rarity, RewardKind } from './types';

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
