import {
  contourSegments,
  mixColor,
  parseHex,
  smoothContour,
  terrain,
  valueNoise,
  type Rgb,
} from '../app/[locale]/utils/topo'

describe('valueNoise', () => {
  test('stays within [0, 1]', () => {
    for (let i = 0; i < 200; i++) {
      const value = valueNoise(i * 0.37 - 20, i * 0.91 + 3)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
  })

  test('gives the same value for the same point', () => {
    expect(valueNoise(1.25, -3.5)).toBe(valueNoise(1.25, -3.5))
  })

  test('has no jump when crossing from one cell to the next', () => {
    const before = valueNoise(2 - 1e-6, 0.4)
    const after = valueNoise(2 + 1e-6, 0.4)
    expect(Math.abs(before - after)).toBeLessThan(1e-4)
  })
})

describe('terrain', () => {
  test('stays within [0, 1]', () => {
    for (let i = 0; i < 100; i++) {
      const value = terrain(i * 0.13, i * 0.29, i * 0.5)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
  })

  test('changes over time', () => {
    expect(terrain(1.3, 2.7, 0)).not.toBe(terrain(1.3, 2.7, 5))
  })
})

describe('contourSegments', () => {
  // Une seule cellule : valeurs dans l'ordre haut-gauche, haut-droite, bas-gauche, bas-droite.
  const segments = (values: number[], level: number, cols = 2, rows = 2) => {
    const out: number[] = []
    contourSegments(values, cols, rows, level, out)
    return out
  }

  test('draws nothing when the whole cell is on one side of the level', () => {
    expect(segments([0, 0, 0, 0], 0.5)).toEqual([])
    expect(segments([1, 1, 1, 1], 0.5)).toEqual([])
  })

  test('cuts a corner that rises above the level', () => {
    // Seul le coin haut-gauche dépasse : le segment relie le bord haut au bord gauche.
    expect(segments([1, 0, 0, 0], 0.5)).toEqual([0.5, 0, 0, 0.5])
  })

  test('places the line where the level falls between two values', () => {
    // Moitié droite au-dessus : ligne verticale au quart de la cellule.
    expect(segments([0, 1, 0, 1], 0.25)).toEqual([0.25, 0, 0.25, 1])
  })

  test('draws two segments for a saddle', () => {
    expect(segments([1, 0, 0, 1], 0.5)).toEqual([0.5, 0, 1, 0.5, 0, 0.5, 0.5, 1])
  })

  test('offsets the segments of the following cells', () => {
    // Deux cellules côte à côte ; seul le coin haut-droite de la grille dépasse.
    expect(segments([0, 0, 1, 0, 0, 0], 0.5, 3, 2)).toEqual([1.5, 0, 2, 0.5])
  })
})

describe('smoothContour', () => {
  const arcs = (segments: number[], cols = 3) => {
    const out: number[] = []
    smoothContour(segments, cols, out)
    return out
  }

  // Un arc tient en six nombres : départ, point de contrôle, arrivée.
  const chunks = (out: number[]) =>
    Array.from({ length: out.length / 6 }, (_, i) => out.slice(i * 6, i * 6 + 6))

  test('draws nothing without segments', () => {
    expect(arcs([])).toEqual([])
  })

  test('rounds the corner between two segments that meet', () => {
    // Deux segments en angle droit, qui se rejoignent en (1, 0.5).
    const [joint] = chunks(arcs([0.5, 0, 1, 0.5, 1, 0.5, 1.5, 1]))

    // L'arc part du milieu du premier, arrive au milieu du second,
    // et le point de rencontre sert de point de contrôle.
    expect(joint).toEqual([0.75, 0.25, 1, 0.5, 1.25, 0.75])
  })

  test('extends in a straight line the ends that have no neighbour', () => {
    // Un segment seul : chaque bout rejoint le bord depuis le milieu.
    expect(arcs([0.5, 0, 0, 0.5])).toEqual([
      0.25, 0.25, 0.5, 0, 0.5, 0,
      0.25, 0.25, 0, 0.5, 0, 0.5,
    ])
  })

  test('joins every pair of neighbours along a contour', () => {
    // Un relief en bosse au centre d'une grille 3 × 3 : la courbe est fermée.
    const values = [0, 0, 0, 0, 1, 0, 0, 0, 0]
    const segments: number[] = []
    contourSegments(values, 3, 3, 0.5, segments)

    const out = arcs(segments)

    // Quatre segments, quatre jonctions, aucun bout laissé seul :
    // chaque arc arrive ailleurs que sur son point de contrôle.
    expect(segments).toHaveLength(16)
    expect(chunks(out)).toHaveLength(4)
    for (const [, , cx, cy, x, y] of chunks(out)) {
      expect([x, y]).not.toEqual([cx, cy])
    }
  })

  test('starts afresh on each call', () => {
    const lonely = [0.5, 0, 0, 0.5]

    expect(arcs(lonely)).toEqual(arcs(lonely))
  })
})

describe('parseHex', () => {
  const fallback: Rgb = [1, 2, 3]

  test('reads a six-digit colour', () => {
    expect(parseHex('#ff7a2f', fallback)).toEqual([255, 122, 47])
  })

  test('reads a three-digit colour, spaces included', () => {
    expect(parseHex(' #0af ', fallback)).toEqual([0, 170, 255])
  })

  test('falls back on anything else', () => {
    expect(parseHex('rgb(1, 2, 3)', fallback)).toBe(fallback)
    expect(parseHex('', fallback)).toBe(fallback)
  })
})

describe('mixColor', () => {
  const low: Rgb = [0, 0, 0]
  const mid: Rgb = [100, 100, 100]
  const high: Rgb = [200, 200, 200]

  test('returns each stop at its position', () => {
    expect(mixColor(low, mid, high, 0, 0.5)).toBe('rgba(0, 0, 0, 0.5)')
    expect(mixColor(low, mid, high, 0.5, 0.5)).toBe('rgba(100, 100, 100, 0.5)')
    expect(mixColor(low, mid, high, 1, 0.5)).toBe('rgba(200, 200, 200, 0.5)')
  })

  test('blends between two stops', () => {
    expect(mixColor(low, mid, high, 0.25, 1)).toBe('rgba(50, 50, 50, 1)')
    expect(mixColor(low, mid, high, 0.75, 1)).toBe('rgba(150, 150, 150, 1)')
  })
})
