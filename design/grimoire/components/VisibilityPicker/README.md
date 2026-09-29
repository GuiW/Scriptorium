GM-side choice of a piece of content's visibility: Toute la table, Certains joueurs, Secret MJ; with « Certains joueurs », the table's roster opens to tick one or more players.

- `level`, `players` (selection) and `onChange({level, players})`; `roster`: the campaign's players `[{id, name, character?}]` (the character shows in grey).
- Default: `table`. `players` content with no player chosen is not valid: the component shows « Choisis au moins un joueur » in bold `crimson`, preceded by ✕; the screen must also disable saving (`Button disabled`).
- Restricted options take the `secret` colour and the hatching once chosen; ticked players get a `secret` rule and ✓.
- Below 520px, the three options stack.
