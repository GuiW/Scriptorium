Mobile tab bar (< 768px) at the bottom of the screen: the active tab carries a `crimson` bookmark hanging from the top edge, like a ribbon sticking out of the top of a page.

- Same `items`, `value` and `onChange` as `BookmarkNav`: one list for all three sizes. Dividers are ignored and only the first 5 entries are shown; put the others (Réglages, Lieux…) behind a « Plus » tab.
- On selection, the bookmark unrolls from the top edge (0.22s, slight bounce) behind the icon, which does not move; animation disabled under `prefers-reduced-motion`.
- Each tab is 64px high across its full width (touch target ≥ 44px). An icon is mandatory here (a ◆ by default), brought down to 16px whatever its original size, with an 11px one-word label.
- `count` becomes an `ember` diamond dot (screen readers read the number): on mobile we signal that there is something new, not how much.
- Pin the bar to the bottom of the screen (`position: fixed; bottom: 0`) and reserve 64px plus the safe area at the bottom of the content; the bar already adds `env(safe-area-inset-bottom)`.
- The campaign name goes in the page header, not in the bar.
