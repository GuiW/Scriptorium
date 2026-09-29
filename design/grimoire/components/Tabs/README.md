Filtre d'une liste par statut, en onglets soulignés — à ne pas confondre avec les signets de `BookmarkNav`/`BookmarkTabs`, réservés à la navigation entre les pages de l'app.

- Fournir `items` (`{id, label, count?}`), `value` (id actif) et `onChange(id)`.
- L'onglet actif passe en `crimson` avec un filet inférieur de 2px ; les autres restent en `ink-muted`, `ink` au survol.
- `count`, en chiffres tabulaires à côté du libellé, couvre toujours l'ensemble des statuts possibles pour ce contenu — y compris 0, jamais masqué en silence dans un autre onglet.
- Chaque onglet est un vrai bouton (`role="tab"`), cible tactile ≥ 44px.
- 2 à 5 onglets au plus ; un filtre plus riche ou à facettes multiples relève d'un menu, pas de `Tabs`.
