# Intégration PrimeNG

Grimoire s'applique à une app Angular 22 + PrimeNG 22 en deux couches : un **preset PrimeNG** qui habille les composants génériques (boutons, champs, onglets, modales, toasts…), et les **classes `gr-*`** de `components/bundle.css` pour les composants métier, réécrits en composants Angular. Les deux lisent les mêmes variables de `tokens.css` : changer de thème ou de couleur se fait à un seul endroit.

## Installation

- Paquets : `primeng@22`, `@primeuix/themes@3`, `@angular/cdk@22`. PrimeNG 22 est publié sous la licence PrimeUI et embarque un gestionnaire de licence : vérifier les conditions sur primeui.dev/licenses avant de s'engager.
- Copier dans l'app `tokens.css` (généré par ce design system), `components/bundle.css` et `integration/grimoire-preset.ts`.
- Charger les polices Google (Cinzel, Alegreya, Alegreya Sans) : `bundle.css` les importe déjà en tête.

`angular.json` — ordre des feuilles de style : les jetons d'abord, puis Grimoire, puis les styles de l'app.

```json
"styles": ["src/styles/tokens.css", "src/styles/grimoire.css", "src/styles.css"]
```

`app.config.ts`

```ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { GrimoirePreset } from './theme/grimoire-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: GrimoirePreset,
        options: {
          prefix: 'p',
          darkModeSelector: '[data-theme="donjon"]',
          cssLayer: { name: 'primeng', order: 'primeng' },
        },
      },
    }),
  ],
};
```

- `darkModeSelector` reprend le sélecteur de `tokens.css` : poser `data-theme="donjon"` sur `<html>` bascule **à la fois** les jetons Grimoire et PrimeNG. Sans attribut, c'est Parchemin.
- `cssLayer` range PrimeNG dans une couche `primeng` : les règles `gr-*` et celles de l'app, hors couche, gagnent toujours sans `!important`.
- Le thème se pilote par un signal, par exemple `theme = signal<'parchemin' | 'donjon'>('parchemin')` et un `effect()` qui écrit `document.documentElement.dataset.theme`.

## Ce que fait le preset

- Base **Aura**, surchargée. Les valeurs sémantiques ne contiennent pas de couleurs : elles pointent vers les variables de `tokens.css` (`var(--surface-raised)`, `var(--ink)`, `var(--crimson)`…). Seules les nuances numérotées `primary.50–950` (cramoisi) et `surface.0–950` (parchemin) sont en dur, parce que quelques composants PrimeNG les lisent.
- **Couleur principale** : `crimson`, texte `on-crimson`, survol `crimson-deep` — un `p-button` par défaut est donc le bouton principal de Grimoire.
- **Champs** : fond `surface-raised`, bordure `border`, focus `arcane`, invalide `crimson`, placeholder `ink-muted`.
- **Focus** : anneau plein de 2px en `focus`, décalé de 2px, partout (Aura met 1px ou rien sur les champs).
- **Surfaces** : panneaux et overlays en `surface-raised`, filet `hairline`, ombre `shadow-lifted` ; élément survolé ou sélectionné en `surface-sunk`.
- **Rayons** : 2px (champs, tags), 4px (boutons, cartes, menus), 8px (modales). Aura arrondit plus ; le parchemin est découpé net.
- **Typographie** : Alegreya Sans à 15px pour tous les composants PrimeNG. Les titres de modale et de panneau passent en Cinzel via `grimoire.css` (voir plus bas).

## Correspondance des composants

| Besoin | PrimeNG | Réglage Grimoire |
| --- | --- | --- |
| Bouton principal | `p-button` | défaut = `crimson` ; une seule action principale par écran |
| Bouton secondaire | `p-button severity="secondary" [outlined]="true"` | bordure `border`, texte `ink` |
| Action discrète | `p-button [text]="true"` | à réserver aux actions dans une carte |
| Champ texte, zone de texte | `pInputText`, `pTextarea` | libellé en `label-caps` au-dessus, jamais de float label |
| Liste déroulante | `p-select`, `p-multiselect` | overlay `surface-raised` |
| Case à cocher | `p-checkbox` | pour les réglages ; les objectifs de quête utilisent le losange `gr-obj` |
| Onglets (En cours / Accomplies / Rumeurs) | `p-tabs` | barre active 2px `crimson` |
| Modale, panneau | `p-dialog`, `p-drawer` | rayon 8px, titre en Cinzel |
| Notification | `p-toast` | « Quête accomplie », confirmations |
| Confirmation | `p-confirmdialog` | bouton destructif en `secondary`, jamais en principal |
| Tableau (butin, sessions) | `p-table` | lignes survolées en `surface-sunk` |
| Statut, récompense | classes `gr-badge` | ne pas utiliser `p-tag` pour les statuts : glyphe et bordure propres à Grimoire |

## Composants métier : en Angular, pas dans PrimeNG

`QuestCard`, `Objective`, `JournalEntry`, `Reputation`, `ContactChip`, `ContactCard`, `BookmarkNav`, `BookmarkTabs`, `Visibility`, `SecretBlock` et `VisibilityPicker` n'ont pas d'équivalent PrimeNG. Les écrire en composants Angular *standalone* qui produisent **le même balisage et les mêmes classes `gr-*`** que les previews de ce design system ; `bundle.css` fait tout le visuel. Les composants React de `bundle.js` servent de référence de comportement, pas de code à embarquer.

- Entrées en `input()` / `input.required()`, sorties en `output()`, état local en `signal()` et `computed()` (par exemple le compteur « 2/4 » d'une `QuestCard`).
- Garder les attributs d'accessibilité des références : `aria-current="page"` sur le signet actif, `role="checkbox"` et `aria-checked` sur le losange d'objectif, `role="img"` et le libellé complet sur `Reputation`.
- `VisibilityPicker` peut s'appuyer sur `p-selectbutton` pour les trois niveaux et `p-togglebutton` pour les joueurs, en restylant avec les classes `gr-vpick__*` ; ou rester un composant maison, plus simple à tenir fidèle.

## grimoire.css — les retouches hors preset

Quelques règles que les jetons PrimeNG n'exposent pas, à ajouter après `bundle.css` :

```css
.p-component { font-family: var(--font-sans); }
.p-dialog-title, .p-drawer-title, .p-panel-title { font-family: var(--font-display); font-weight: 600; }
.p-dialog-mask { background: rgba(23, 19, 15, 0.55); }
.p-toast-message { border: 1px solid var(--hairline); box-shadow: var(--shadow-lifted); }
```

- Vérifier le nom exact d'un jeton ou d'une classe dans l'onglet « Theming » de chaque composant PrimeNG avant d'en ajouter : un jeton inconnu est ignoré sans erreur.
