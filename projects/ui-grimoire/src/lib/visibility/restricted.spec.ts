import { restrictedVisibility } from './restricted';

describe('restrictedVisibility', () => {
  it('keeps a GM secret or a selection of players, drops the whole table', () => {
    const gm = { level: 'gm' as const };
    const kyra = { level: 'players' as const, players: [{ name: 'Kyra' }] };
    expect(restrictedVisibility(gm)).toBe(gm);
    expect(restrictedVisibility(kyra)).toBe(kyra);
    expect(restrictedVisibility({ level: 'table' })).toBeNull();
    expect(restrictedVisibility(undefined)).toBeNull();
  });
});
