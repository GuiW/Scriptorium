Choix de la visibilité d'un contenu, côté MJ : Toute la table, Certains joueurs, Secret MJ ; avec « Certains joueurs », la liste de la table s'ouvre pour cocher un ou plusieurs joueurs.

- `level`, `players` (sélection) et `onChange({level, players})` ; `roster` : les joueurs de la campagne `[{id, name, character?}]` (le personnage s'affiche en gris).
- Défaut : `table`. Un contenu `players` sans joueur choisi n'est pas valide : le composant affiche « Choisis au moins un joueur » en `crimson` gras, précédé de ✕ ; l'écran doit en plus désactiver l'enregistrement (`Button disabled`).
- Les options restreintes prennent la couleur `secret` et les hachures une fois choisies ; les joueurs cochés, un filet `secret` et ✓.
- Sous 520px, les trois options s'empilent.
