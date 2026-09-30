# Design system gaps — Quêtes page

What the system does not cover yet, or covers poorly. No style is invented: every line waits for a decision.

## Resolved (in the design system, version 24)

| Need | Resolution |
|---|---|
| Filter by status (En cours / Accomplies / Échouées / Rumeurs) | `Tabs` component added, 4 tabs, distinct from the navigation bookmarks |
| `VisibilityPicker` message « Choisis au moins un joueur » | Shown in bold `crimson` with ✕ when no player is ticked; the screen must disable « Créer » (see the canvas's "incomplete visibility" screen) |
| Bookmark shadows in the Dungeon theme (`BookmarkNav`, `BookmarkTabs`) | `[data-theme="dungeon"]` variant in `bundle.css` (black rather than brown) |
| `secret` pink too bright in Dungeon (read as a selected state) | `#d9a3cb` → `#c4a5bd`; hatching aligned |

## Open

| Need | Where | Lead, with no new style |
|---|---|---|
| Adding a quest on mobile: no "modal sheet" component | « Nouvelle quête » screen | Full-screen page (Annuler / Créer bar, `title-lg` title, `TextField` fields, `VisibilityPicker`); to be approved before creating a `Sheet` component |
| Tabs and cards are not interactive in the mockups | Whole page | Behaviour to specify: the tab filter filters the grid, selecting a card opens the panel (desktop) or the page (tablet, mobile) |
| Number of `Tabs` on a small screen (4 tabs at 390px) | Mobile | To test for real; if it overflows, horizontal scrolling or 3 tabs + « Autres » |
| « Rumeurs » tab: can rumours be promoted to quests? | Product | Product decision before the code |
| `sm` button in desktop toolbars (the panel's « Fermer ») | Desktop | Acceptable with a mouse; to revisit if the app is used by touch on a large screen |

## Found during the "theme foundations" slice

| Need | Where | Finding | Lead, with no new style | Status |
|---|---|---|---|---|
| 44px touch targets | All buttons, tablet and mobile | CLAUDE.md requires 44px for `Button` at its default size; `.gr-btn` had `min-height: 40px`. | `min-height: 44px` in `bundle.css`, text and padding unchanged; measured at 44px in both themes. | **Fixed** in `bundle.css`. |
| Generic components with no Grimoire style: dropdown, modal, side panel, toast, settings checkbox | First screen that needs one | The design system only covers `Button`, `TextField` and `Badge`. PrimeNG was dropped: no style is provided for the rest. The modal backdrop has no token either. | Behaviour from `@angular/aria` or `@angular/cdk`; visuals to design in the design system with the existing tokens (`surface-raised`, `hairline`, `shadow-lifted`, `radius-lg`), plus a backdrop token. | **Decision pending** before the first need (already the case for the mobile modal sheet, above). |

## Found during the "leaf components" slice

| Need | Where | Finding | Lead, with no new style | Status |
|---|---|---|---|---|
| Reputation steps that can be told apart | `Reputation`, Parchment | The five `rep-*` Parchment values are all very dark (≥ 7.2:1, AAA) and too close to each other: OKLab ΔE of 5 to 9 between neighbours (`hostile`/`cold` 6, `cold`/`neutral` 5). The word carries the meaning, but the colour no longer reinforces it. | Target AA (≥ 4.5:1 on `surface`, `surface-raised` and `surface-sunk`, which still holds for the 13px bold `surface` text on the label) instead of AAA, and use the freed lightness for chroma. The fully saturated version (`#bc0730`, `#8e4e00`, `#5d5d5d`, `#06658e`, `#066e1d`) was judged too vivid; chroma was lowered to 75 % at the same hues. Dungeon values unchanged. | **Fixed** in `tokens.json`: `rep-hostile` `#a8353e`, `rep-cold` `#835328`, `rep-neutral` `#5e5e5e`, `rep-warm` `#2d6482`, `rep-ally` `#2e6b32` (4.5 to 4.6:1, neighbour ΔE 8 to 13). Design system README, Reputation README and token `usage` updated. |

## How to use

Any new gap found during implementation is added here with: the screen concerned, what is missing, the solution that only uses what exists, and the decision expected.
