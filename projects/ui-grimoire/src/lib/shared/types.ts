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
