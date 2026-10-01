Frame for any restricted content (note, journal paragraph, clue): dashed `secret` rule (the same for GM secrets and chosen players: the tab tells them apart), `Visibility` tab set on the top edge, discreet hatched band at the top.

- `level`: `gm` (default) or `players`; `players`: `[{name, you?}]`.
- `children`: the content, in `body` by default.
- Use it for a block inside a public page. For a whole quest, pass `visibility` to `QuestCard`; for an objective, to `Objective`.
- Do not nest two secret frames.
