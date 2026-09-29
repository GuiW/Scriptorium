Restricted-visibility marker: « Secret MJ » (broken seal, dashed rule) or « Pour toi et Kyra » (player faces, dotted rule). `secret` colour on `secret-hatch` hatching, always with a glyph and a word.

- `level`: `table` (default, nothing is shown — public is the norm), `gm` or `players`.
- `players`: `[{name, you?}]`. With `you: true`, the label becomes « Pour toi et… »: this is what a player it concerns sees. Beyond three names: « Pour Ezren, Kyra et +2 », with the full list on hover.
- `compact` drops the « Pour » (in an objective line). `showPublic` exceptionally shows « Toute la table » (in a form).
- The GM sees every marker; a player never sees `gm` content, and only sees `players` content when listed — the app filters, the badge hides nothing.
