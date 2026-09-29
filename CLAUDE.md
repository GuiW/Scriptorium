# Interface — Grimoire design system

Visual source of truth: `design/grimoire/` (tokens.json, README.md, component READMEs, bundle.css).
Reference mockups: `design/quetes/` (exported canvas, Parchment and Dungeon screenshots).

## Rules

- Angular 22 (Node 24), standalone components, state in signals, Angular CLI workspace (`projects/`): Grimoire components go in a dedicated library (`ui-grimoire`), the Quêtes page in the feature's library.
- No hard-coded colour, font size, spacing, radius or shadow: only the CSS variables from `tokens.css` (`var(--surface)`, `var(--space-4)`…). That file is generated from `design/grimoire/tokens.json`: never edit it by hand, rerun the generator.
- Themes: Parchment (default) and Dungeon, through the `data-theme="dungeon"` attribute on an ancestor. Every component must be checked in both.
- No styled component library (no PrimeNG, no Material…): we would spend our time fighting its styles. Every component, generic (Button, TextField, Badge) or business (QuestCard, Objective, Reputation, Visibility, SecretBlock, VisibilityPicker, RewardList, Tabs, BookmarkNav, BookmarkTabs), is written in Angular in `ui-grimoire`, with the same `gr-*` classes as `bundle.css` and the same prop names as `index.d.ts`.
- Behaviour (keyboard, focus, ARIA): start from `@angular/aria` or `@angular/cdk`, which bring no styles, when they cover the need; otherwise a custom component.
- A need not covered by a component or a token: do not invent a style. Add it to `design/GAPS.md`, propose a solution using what exists, and wait for a decision.

## Accessibility (non-negotiable)

- A status or a visibility = a glyph AND a word, never colour alone (◆ En cours, ✓ Accomplie, ✕ Échouée, ? Rumeur; Secret MJ / « Pour toi »).
- Focus ring `var(--focus)`, 2px, offset by 2px, on every interactive element.
- Touch targets ≥ 44px on tablet and mobile: `Button` at its default size, never `sm`.
- Navigation between pages: BookmarkNav / BookmarkTabs. Filtering a list by status: `Tabs`. Never swap them.

## Language and tone

- Code, comments, test names, commit messages and documentation (design system included) are in English.
- The interface is in French, sentence case, action labels in the infinitive (« Ajouter un objectif »). No emoji, no « OK » and no « Valider » on its own.
- Table vocabulary: quête, objectif, session, donneur, récompense.
- Statuses: En cours, Accomplie, Échouée, Rumeur.

## Method

- Work in slices: tokens and theme, then components one by one (leaves before composites), then navigation, then the page.
- For each slice: an approved plan before the code, one rendering test per component (every status, dark theme), a separate commit.
- Demo data: reuse the canvas's (6 quests, one of them Secret MJ and one shared with Kyra).
