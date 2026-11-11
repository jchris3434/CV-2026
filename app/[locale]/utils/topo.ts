// Outils du fond animé : un relief généré par du bruit, et le mélange de
// couleurs qui le colore.

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
