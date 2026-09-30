import type { PlayerRef } from '../shared/types';

/**
 * French list of the players a content is shared with, as read by the viewer:
 * « toi » first when the viewer is listed, then the others; beyond three names,
 * « Ezren, Kyra et +2 » (playerNames in design/grimoire/components/bundle.js).
 */
export function playerNames(players: readonly PlayerRef[]): string {
  const you = players.some((p) => p.you);
  const others = players.filter((p) => !p.you).map((p) => p.name);
  let names = [...(you ? ['toi'] : []), ...others];
  if (names.length > 3) names = [...names.slice(0, 2), `+${names.length - 2}`];
  return names.length > 1
    ? `${names.slice(0, -1).join(', ')} et ${names[names.length - 1]}`
    : (names[0] ?? '');
}
