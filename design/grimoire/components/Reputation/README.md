Position d'un PNJ ou d'une faction envers le groupe, sur une échelle de 5 crans : un losange plein marque le cran actuel, le mot l'accompagne toujours.

- `kind="npc"` (défaut) : Hostile, Inamical, Indifférent, Amical, Serviable — les attitudes de PF2e. `kind="faction"` : Haï, Méfiant, Ignoré, Apprécié, Vénéré.
- `value` : indice 0–4 (défaut : le cran central). `labels` permet une autre échelle (par ex. les 7 crans de réputation de faction de PF2e) ; les couleurs se répartissent sur la longueur.
- Couleurs : `rep-hostile` → `rep-cold` → `rep-neutral` → `rep-warm` → `rep-ally`, plus soutenues que les couleurs de statut (≥ 7:1 sur toute surface). Le mot, en étiquette pleine, porte le sens ; la couleur le renforce.
- `trend` : ▲ / ▼ discret pour signaler un changement depuis la dernière session.
- C'est une position, pas une jauge : ne jamais l'afficher en pourcentage ni en barre remplie.
