# Design folder

- `grimoire/`: the design system (tokens, component READMEs, reference CSS and JS). `tokens.json` is the source of truth for colours, fonts, spacing, radii and shadows.
- `quetes/`: the sources of the Quêtes page mockups (desktop, tablet, mobile, adding a quest, error state). They are canvas-format files, to read for the structure and the demo data, not to open as-is in a browser.
- `GAPS.md`: what the system does not cover yet.

Notes:
- There is no `tokens.css` here: it is generated from `tokens.json` (`npm run tokens`).
- The 22 icons are Lucide icons; the mapping to Lucide names is in `grimoire/assets/Icons/README.md`.
- `grimoire/components/bundle.js` is the React reference implementation (behaviour, `gr-*` classes), not code to ship.
