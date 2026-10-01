Grimoire is the visual system of a quest journal for tabletop role-playing groups (D&D 5e, Pathfinder 2e). The app should look like a well-kept campaign notebook: parchment, ink, a wax seal — not a video game. Ornament stays rare and serves reading; the interface fades behind the story.

## Principles

- **Story first.** Long text (session journal, summaries) rules: `body-lg` in Alegreya, a 60–72 character measure, never in narrow columns.
- **A seal, not a coat of arms.** `crimson` is the wax of the seal: one main action per screen, the journal's drop cap, a failed quest. Never use it as a page background.
- **Gilding is earned.** `gold` is for ornaments, rewards and the selected card. No `gold` text on parchment: use `gold-ink`.
- **Sharp edges.** Cut parchment, no pills: `radius-sm` and `radius-md` are enough; `radius-lg` for modals only.

## Tone and writing

The interface is in French; the rules below apply to French copy.

- Formal « vous » or impersonal wording in the interface (« Ajouter un objectif »), the narrative voice in content. No emoji.
- Sentence case everywhere, except `label-caps` (Cinzel is already capitals).
- Name things as they are named at the table: *quête*, *objectif*, *session*, *donneur*, *récompense*. Statuses: **En cours**, **Accomplie**, **Échouée**, **Rumeur**.
- Session numbers in Roman numerals in kickers (`SESSION XIV`), Arabic numerals elsewhere.

## Colour

- `ink` on `surface`, `surface-raised` or `surface-sunk` for all text; `ink-muted` for metadata.
- Quest statuses: En cours → `arcane` + ◆; Accomplie → `forest` + ✓; Échouée → `crimson` + ✕; Rumeur → `ink-muted` + ?. Always a glyph **and** a word: `forest` and `crimson` cannot be told apart by hue alone.
- `ember` for urgency (deadline, danger); `gold-ink` for rewards (po, XP).
- Item rarity (PF2e): Peu courant `ember`, Rare `arcane`, Unique `gold-ink` circled in `gold`; always spelled out.
- Two themes: **Parchment** (light, default) and **Dungeon** (dark, for evening play). Every text/background pair meets 4.5:1 in both.
- Focus: a solid 2px `focus` ring, offset by 2px, on every interactive element.

## Typography

- **Cinzel** (`display`) for headings only — `display`, `title-lg`, `title-md`, `label-caps`. Never for a paragraph.
- **Alegreya** (`serif`) for everything that is read: `body-lg`, `body`, `quote` (italic, NPC speech).
- **Alegreya Sans** (`sans`) for the interface: `ui`, `ui-sm`, `numeral` (tabular figures for po, XP, 3/5).
- Fonts hosted by Google Fonts; `components/bundle.css` imports them.

## Space, shape, depth

- 4px grid: `space-6` inside cards, `space-4` between them, `space-8` between sections.
- Cards: `surface-raised`, `hairline` rule, `radius-md`, `shadow-card`; `shadow-lifted` on hover. Selected card: 2px `gold` rule.
- Objective boxes are diamonds (a `radius-sm` square rotated 45°) — the system's only recurring motif.
- Ornamental dividers: a `hairline` rule broken by a `gold` diamond. One per journal entry, no more.

## Iconography

- **Lucide** (ISC licence, free to use including commercially, keeping the notice) with a **1.5px** stroke on a 24px grid. 22 business icons with French names (`quete`, `journal`, `pnj`, `faction`, `lieu`, `butin`, `rumeur`, `secret`…): the `Icon` component, SVG files in the « Icons » group.
- Sizes: 16px in a line of text, 20px in buttons and lists, 24px in navigation. `ink-muted` at rest, otherwise the colour of the text they accompany.
- An icon goes with a word; on its own, it carries a `label`. Quest statuses keep their glyphs (◆ ✓ ✕ ?) and Secret MJ its broken seal.
- Never emoji or clipart of dice or swords in the interface; a missing icon is taken from Lucide, never from another game.

## NPCs and factions

- A contact exists to say **who a quest comes from** and **where they stand with the party** — nothing more. No stats, HP or inventory: it is not a character sheet.
- Shape = nature: a round seal for an NPC, a shield for a faction, circled in `gold`. Initial in Cinzel when there is no portrait.
- Reputation is a **position** on 5 steps (PF2e attitudes for NPCs), never a gauge or a percentage; the word always goes with the colour. Dedicated colours `rep-hostile`, `rep-cold`, `rep-neutral`, `rep-warm`, `rep-ally` (≥ 4.5:1 on every surface in Parchment, ≥ 7:1 in Dungeon), the label as a filled tag with `surface` text.
- In a quest, the giver appears as a `ContactChip`; the `ContactCard` fits in four lines.

## Visibility: Secret MJ and chosen players

- Three levels for any content (quest, objective, note, contact): **Toute la table** (default, no marker), **Certains joueurs** (the GM plus a selection) and **Secret MJ**.
- Restricted content is recognisable at a glance, in the `secret` colour reserved for that meaning: the same **dashed** rule (solid on the small markers) for Secret MJ and for a selection of players, told apart by the label: broken seal + « Secret MJ », player faces + « Pour Kyra »; `secret-hatch` hatching as decoration. Always a glyph and a word.
- On the player side, content shared with them reads « Pour toi » (or « Pour toi et Kyra »); the rest is simply not sent. The marker informs, it protects nothing: the app does the filtering.
- The GM chooses with `VisibilityPicker`; it is displayed with `Visibility` (badge), `SecretBlock` (block), or the `visibility` prop of `QuestCard` and `Objective`.

## Navigation

- One list of entries, three presentations depending on width, all as book bookmarks with the active bookmark in `crimson`:
  - **Desktop (≥ 1200px)** — `BookmarkNav`: 240px column on the left, bookmarks with label and counter.
  - **Tablet (768–1199px)** — `BookmarkNav variant="rail"`: 88px column, icon + short label.
  - **Mobile (< 768px)** — `BookmarkTabs`: bar at the bottom of the screen, 5 tabs at most, the active tab's bookmark hangs from the top edge.
- On tablet and mobile, icons are mandatory; the campaign name moves to the page header.
- Filtering a list by status (En cours / Accomplies / Échouées / Rumeurs, for example) is a different need from navigating between pages: use `Tabs` (`StatusFilter` in Angular, a single-choice radio group that looks like tabs), never the bookmarks of `BookmarkNav`/`BookmarkTabs`, which are reserved for the app's pages.

## Components

`Button`, `Badge`, `TextField`, `QuestCard`, `Objective`, `JournalEntry`, `Reputation`, `ContactChip`, `ContactCard`, `BookmarkNav`, `BookmarkTabs`, `Tabs`, `Visibility`, `SecretBlock`, `VisibilityPicker`, `RewardList`, `Icon` — exposed as `window.Grimoire` (React 18). See each one's README.

## Angular integration

For an Angular 22 app with no styled component library: every component, generic (`Button`, `TextField`, `Badge`) or business, is written as a *standalone* Angular component that produces **the same markup and the same `gr-*` classes** as the previews; `components/bundle.css` does all the visual work, from the `tokens.css` variables. The React components in `bundle.js` are a behaviour reference, not code to ship.

- Global stylesheets, in this order: `tokens.css` (generated from `tokens.json`), `components/bundle.css`, then the app's styles.
- Theme: the `data-theme="dungeon"` attribute on `<html>`; without the attribute, it is Parchment.
- Behaviour (keyboard, focus, ARIA roles): start from `@angular/aria` or `@angular/cdk` when they cover the need (tabs, lists, menus, overlays). They bring no styles.
- Inputs with `input()` / `input.required()`, outputs with `output()`, local state with `signal()` and `computed()` (for example a `QuestCard`'s « 2/4 » counter), same prop names as `components/index.d.ts`.
- Keep the reference accessibility attributes: `aria-current="page"` on the active bookmark, `role="checkbox"` and `aria-checked` on the objective diamond, `role="img"` and the full label on `Reputation`.
