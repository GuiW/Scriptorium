Grimoire est le système visuel d'un journal de quêtes pour tables de jeu de rôle (D&D 5e, Pathfinder 2e). L'app doit ressembler à un carnet de campagne bien tenu : du parchemin, de l'encre, un sceau de cire — pas à un jeu vidéo. L'ornement reste rare et sert la lecture ; l'interface disparaît derrière le récit.

## Principes

- **Le récit d'abord.** Le texte long (journal de session, résumés) est roi : `body-lg` en Alegreya, mesure de 60–72 caractères, jamais en colonnes étroites.
- **Un sceau, pas un blason.** Le `crimson` est la cire du sceau : une action principale par écran, la lettrine du journal, l'échec d'une quête. Ne jamais en faire un fond de page.
- **La dorure se mérite.** `gold` sert aux ornements, aux récompenses et à la carte sélectionnée. Pas de texte `gold` sur parchemin : utiliser `gold-ink`.
- **Des bords nets.** Parchemin découpé, pas de pilules : `radius-sm` et `radius-md` suffisent ; `radius-lg` pour les modales seulement.

## Ton et rédaction

- Vouvoiement ou impersonnel dans l'interface (« Ajouter un objectif »), voix du récit dans le contenu. Pas d'emoji.
- Casse de phrase partout, sauf `label-caps` (Cinzel est déjà en capitales).
- Nommer les choses comme à la table : *quête*, *objectif*, *session*, *donneur*, *récompense*. Les statuts : **En cours**, **Accomplie**, **Échouée**, **Rumeur**.
- Numéros de session en chiffres romains dans les surtitres (`SESSION XIV`), en chiffres arabes ailleurs.

## Couleur

- `ink` sur `surface`, `surface-raised` ou `surface-sunk` pour tout texte ; `ink-muted` pour les métadonnées.
- Statuts de quête : En cours → `arcane` + ◆ ; Accomplie → `forest` + ✓ ; Échouée → `crimson` + ✕ ; Rumeur → `ink-muted` + ?. Toujours glyphe **et** mot : `forest` et `crimson` ne se distinguent pas par la teinte seule.
- `ember` pour l'urgence (échéance, danger) ; `gold-ink` pour les récompenses (po, XP).
- Rareté des objets (PF2e) : Peu courant `ember`, Rare `arcane`, Unique `gold-ink` cerclé de `gold` ; toujours écrite en toutes lettres.
- Deux thèmes : **Parchemin** (clair, par défaut) et **Donjon** (sombre, pour jouer en soirée). Tous les couples texte/fond respectent 4.5:1 dans les deux.
- Focus : anneau `focus` de 2px plein, décalé de 2px, sur tout élément interactif.

## Typographie

- **Cinzel** (`display`) pour les titres uniquement — `display`, `title-lg`, `title-md`, `label-caps`. Jamais pour un paragraphe.
- **Alegreya** (`serif`) pour tout ce qui se lit : `body-lg`, `body`, `quote` (italique, paroles de PNJ).
- **Alegreya Sans** (`sans`) pour l'interface : `ui`, `ui-sm`, `numeral` (chiffres tabulaires pour po, XP, 3/5).
- Polices hébergées par Google Fonts ; `components/bundle.css` les importe.

## Espace, formes, profondeur

- Grille de 4px : `space-6` dans les cartes, `space-4` entre elles, `space-8` entre sections.
- Cartes : `surface-raised`, filet `hairline`, `radius-md`, `shadow-card` ; au survol `shadow-lifted`. Carte sélectionnée : filet `gold` de 2px.
- Les cases d'objectif sont des losanges (carré `radius-sm` tourné de 45°) — le seul motif récurrent du système.
- Séparateurs ornementaux : un filet `hairline` interrompu par un losange `gold`. Un par entrée de journal, pas plus.

## Iconographie

- **Lucide** (licence ISC, usage libre y compris commercial, en gardant la notice) au trait de **1.5px**, 24px de grille. 22 icônes métier nommées en français (`quete`, `journal`, `pnj`, `faction`, `lieu`, `butin`, `rumeur`, `secret`…) : composant `Icon`, fichiers SVG dans le groupe « Icons ».
- Tailles : 16px dans une ligne de texte, 20px dans les boutons et listes, 24px dans la navigation. Couleur `ink-muted` au repos, sinon celle du texte qu'elles accompagnent.
- Une icône accompagne un mot ; seule, elle porte un `label`. Les statuts de quête gardent leurs glyphes (◆ ✓ ✕ ?) et le Secret MJ son sceau brisé.
- Jamais d'emoji ni d'illustrations clipart de dés ou d'épées dans l'interface ; une icône qui n'existe pas se prend dans Lucide, jamais d'un autre jeu.

## PNJ et factions

- Un contact existe pour dire **de qui vient une quête** et **où il en est avec le groupe** — rien de plus. Pas de caractéristiques, PV ou inventaire : ce n'est pas une fiche de personnage.
- Forme = nature : sceau rond pour un PNJ, écu pour une faction, cerclés de `gold`. Initiale en Cinzel si pas de portrait.
- La réputation est une **position** sur 5 crans (attitudes de PF2e pour les PNJ), jamais une jauge ni un pourcentage ; le mot accompagne toujours la couleur. Couleurs dédiées `rep-hostile`, `rep-cold`, `rep-neutral`, `rep-warm`, `rep-ally` (≥ 7:1 sur toutes les surfaces), l'étiquette en aplat avec le texte en `surface`.
- Dans une quête, le donneur apparaît en `ContactChip` ; la `ContactCard` tient en quatre lignes.

## Visibilité : Secret MJ et joueurs choisis

- Trois niveaux pour tout contenu (quête, objectif, note, contact) : **Toute la table** (défaut, sans marqueur), **Certains joueurs** (le MJ + une sélection) et **Secret MJ**.
- Tout contenu restreint se reconnaît au premier coup d'œil, dans la couleur `secret` réservée à ce sens : filet **tireté** + sceau brisé pour Secret MJ, filet **pointillé** + visages des joueurs pour une sélection, hachures `secret-hatch` en décor. Toujours un glyphe et un mot.
- Côté joueur, un contenu partagé avec lui s'affiche « Pour toi » (ou « Pour toi et Kyra ») ; le reste n'est simplement pas envoyé. Le marqueur informe, il ne protège rien : le filtrage est fait par l'app.
- Le MJ choisit avec `VisibilityPicker` ; on affiche avec `Visibility` (badge), `SecretBlock` (bloc), ou la prop `visibility` de `QuestCard` et `Objective`.

## Navigation

- Une seule liste d'entrées, trois présentations selon la largeur, toutes en signets de livre avec le signet actif en `crimson` :
  - **Bureau (≥ 1200px)** — `BookmarkNav` : colonne de 240px à gauche, signets avec libellé et compteur.
  - **Tablette (768–1199px)** — `BookmarkNav variant="rail"` : colonne de 88px, icône + libellé court.
  - **Mobile (< 768px)** — `BookmarkTabs` : barre en bas d'écran, 5 onglets au plus, le signet de l'onglet actif pend du bord supérieur.
- Sur tablette et mobile, les icônes sont obligatoires ; le nom de la campagne passe dans l'en-tête de page.
- Filtrer une liste par statut (En cours / Accomplies / Échouées / Rumeurs, par exemple) est un autre besoin que la navigation entre pages : utiliser `Tabs`, jamais les signets de `BookmarkNav`/`BookmarkTabs`, réservés aux pages de l'app.

## Composants

`Button`, `Badge`, `TextField`, `QuestCard`, `Objective`, `JournalEntry`, `Reputation`, `ContactChip`, `ContactCard`, `BookmarkNav`, `BookmarkTabs`, `Tabs`, `Visibility`, `SecretBlock`, `VisibilityPicker`, `RewardList`, `Icon` — exposés sous `window.Grimoire` (React 18). Voir la fiche de chacun.

## Intégration Angular / PrimeNG

Pour une app Angular 22 + PrimeNG 22 : preset `integration/grimoire-preset.ts` (base Aura, branché sur les variables de `tokens.css`) pour les composants génériques, classes `gr-*` de `components/bundle.css` pour les composants métier réécrits en Angular. Détail dans la section « Intégration PrimeNG ».
