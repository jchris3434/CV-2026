// Outils du fond « carte topographique » : un relief généré par du bruit,
// découpé en courbes de niveau (algorithme des « marching squares »),
// puis lissé pour que les courbes n'aient aucun angle.

export type Rgb = readonly [number, number, number];

// Hachage entier déterministe -> nombre dans [0, 1].
function hash(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

// Lissage quintique : dérivées nulles aux bornes, donc des courbes sans cassure.
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Bruit de valeur 2D lissé, dans [0, 1].
export function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// Altitude du relief en (x, y) à l'instant t, dans [0, 1].
// Deux couches de bruit qui glissent dans des directions différentes :
// le relief se déforme lentement au lieu de simplement défiler. Pas de
// couche de détails fins : elle hachait les courbes en petits zigzags.
export function terrain(x: number, y: number, t: number): number {
  return (
    0.72 * valueNoise(x + t * 0.35, y - t * 0.2) +
    0.28 * valueNoise(x * 1.9 - t * 0.25 + 17.3, y * 1.9 + t * 0.3 + 4.7)
  );
}

// Pour chacun des 16 cas d'une cellule : paires d'arêtes reliées par un segment.
// Arêtes : 0 = haut, 1 = droite, 2 = bas, 3 = gauche.
const CASES: readonly (readonly number[])[] = [
  [],
  [3, 2],
  [2, 1],
  [3, 1],
  [0, 1],
  [0, 3, 2, 1],
  [0, 2],
  [0, 3],
  [0, 3],
  [0, 2],
  [0, 1, 3, 2],
  [0, 1],
  [3, 1],
  [2, 1],
  [3, 2],
  [],
];

// Position (entre 0 et 1) du niveau entre deux valeurs voisines.
function ratio(level: number, from: number, to: number): number {
  return (level - from) / (to - from);
}

/**
 * Ajoute dans `out` les segments de la courbe de niveau `level`,
 * sous la forme x1, y1, x2, y2 exprimés en coordonnées de grille.
 * `values` contient cols × rows altitudes, ligne par ligne.
 */
export function contourSegments(
  values: ArrayLike<number>,
  cols: number,
  rows: number,
  level: number,
  out: number[],
): void {
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = values[j * cols + i];
      const tr = values[j * cols + i + 1];
      const bl = values[(j + 1) * cols + i];
      const br = values[(j + 1) * cols + i + 1];

      const index =
        (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      const edges = CASES[index];

      for (const edge of edges) {
        if (edge === 0) {
          out.push(i + ratio(level, tl, tr), j);
        } else if (edge === 1) {
          out.push(i + 1, j + ratio(level, tr, br));
        } else if (edge === 2) {
          out.push(i + ratio(level, bl, br), j + 1);
        } else {
          out.push(i, j + ratio(level, tl, bl));
        }
      }
    }
  }
}

// Repère l'arête de la grille sur laquelle se trouve un bout de segment.
// Deux cellules voisines calculent exactement le même point pour l'arête
// qu'elles partagent : elles obtiennent donc la même clé.
function edgeKey(x: number, y: number, cols: number): number {
  const cell = Math.floor(y) * cols + Math.floor(x);
  return Number.isInteger(y) ? cell * 2 : cell * 2 + 1;
}

// Bouts de segment qui attendent leur voisin, par arête (voir smoothContour).
const pending = new Map<number, number>();

/**
 * Transforme les segments d'une courbe de niveau en arcs sans angle.
 *
 * Deux segments voisins se rejoignent en un point. Au lieu de tracer la ligne
 * brisée, on relie le milieu de l'un au milieu de l'autre par un arc dont ce
 * point est le point de contrôle : les arcs s'enchaînent sans cassure.
 * Un bout sans voisin (bord de la grille) est prolongé en ligne droite.
 *
 * Ajoute dans `out` un arc par jonction : départ, point de contrôle, arrivée
 * (x1, y1, cx, cy, x2, y2), en coordonnées de grille.
 */
export function smoothContour(segments: ArrayLike<number>, cols: number, out: number[]): void {
  const middleX = (segment: number) => (segments[segment] + segments[segment + 2]) / 2;
  const middleY = (segment: number) => (segments[segment + 1] + segments[segment + 3]) / 2;

  for (let segment = 0; segment < segments.length; segment += 4) {
    for (let end = 0; end < 4; end += 2) {
      const x = segments[segment + end];
      const y = segments[segment + end + 1];
      const key = edgeKey(x, y, cols);
      const neighbour = pending.get(key);

      if (neighbour === undefined) {
        pending.set(key, segment + end);
      } else {
        pending.delete(key);
        const other = neighbour - (neighbour % 4);
        out.push(middleX(other), middleY(other), x, y, middleX(segment), middleY(segment));
      }
    }
  }

  for (const lonely of pending.values()) {
    const segment = lonely - (lonely % 4);
    const x = segments[lonely];
    const y = segments[lonely + 1];
    out.push(middleX(segment), middleY(segment), x, y, x, y);
  }
  pending.clear();
}

// « #rrggbb » ou « #rgb » -> [r, g, b]. Renvoie `fallback` si la valeur est illisible.
export function parseHex(value: string, fallback: Rgb): Rgb {
  const hex = value.trim().replace('#', '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return fallback;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

// Couleur à la position t (0 -> 1) d'un dégradé à trois arrêts.
export function mixColor(low: Rgb, mid: Rgb, high: Rgb, t: number, alpha: number): string {
  const [from, to, k] = t < 0.5 ? [low, mid, t * 2] : [mid, high, (t - 0.5) * 2];
  const channel = (n: number) => Math.round(from[n] + (to[n] - from[n]) * k);
  return `rgba(${channel(0)}, ${channel(1)}, ${channel(2)}, ${alpha})`;
}
