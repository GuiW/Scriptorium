A quest objective with a diamond checkbox; place it inside `<ul className="gr-objs">`.

- `done` checks the diamond in `forest` and strikes the label through in `ink-muted`.
- `optional` adds « (facultatif) » in italics.
- `onToggle` receives the click; the box is a keyboard-accessible `role="checkbox"`. The label is a `<label>` for the box: its text is the checkbox name (« Retrouver le médaillon, case à cocher, cochée ») and a click anywhere on the row toggles it. On touch screens (`pointer: coarse`) each row is at least 44px high.
- Label = a concrete action in the infinitive (« Retrouver le médaillon »), one line if possible.
- `visibility` `{level, players}`: dashed `secret` box and a small badge after the label (« Secret MJ », « Kyra »).
