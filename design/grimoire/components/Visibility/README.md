Marqueur de visibilité restreinte : « Secret MJ » (sceau brisé, filet tireté) ou « Pour toi et Kyra » (visages des joueurs, filet pointillé). Couleur `secret` sur hachures `secret-hatch`, toujours avec un glyphe et un mot.

- `level` : `table` (défaut, rien n'est affiché — le public est la norme), `gm` ou `players`.
- `players` : `[{name, you?}]`. Avec `you: true`, le libellé devient « Pour toi et… » : c'est ce que voit un joueur concerné. Au-delà de trois noms : « Pour Ezren, Kyra et +2 », la liste complète au survol.
- `compact` retire le « Pour » (dans une ligne d'objectif). `showPublic` affiche exceptionnellement « Toute la table » (dans un formulaire).
- Le MJ voit tous les marqueurs ; un joueur ne voit jamais un contenu `gm`, et ne voit un contenu `players` que s'il est dans la liste — l'app filtre, le badge ne cache rien.
