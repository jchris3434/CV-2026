import {
  mixColor,
  parseHex,
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
