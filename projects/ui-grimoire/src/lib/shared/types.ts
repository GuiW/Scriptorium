/** Shared domain types, same shapes as design/grimoire/components/index.d.ts. */

export type ContactKind = 'npc' | 'faction';

export type VisibilityLevel = 'table' | 'players' | 'gm';

export interface PlayerRef {
  id?: string;
  name: string;
  /** The current viewer: the label reads « Pour toi… ». */
  you?: boolean;
  character?: string;
}

export interface VisibilityValue {
  level: VisibilityLevel;
  players?: PlayerRef[];
}

export interface QuestObjective {
  label: string;
  done?: boolean;
  optional?: boolean;
  visibility?: VisibilityValue;
}

export type RewardKind = 'coin' | 'xp' | 'item' | 'reputation' | 'other';

/** PF2e rarity, items only. */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'unique';

export interface Reward {
  kind: RewardKind;
  /** « 250 po », « 80 XP », « Lame de lune », « Chevaliers de Lastwall +1 ». */
  label: string;
  rarity?: Rarity;
  note?: string;
  /** Character who received it. */
  to?: string;
  claimed?: boolean;
  visibility?: VisibilityValue;
}
