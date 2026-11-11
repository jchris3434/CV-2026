import type { PointerEvent } from 'react'
import { resetPointer, trackPointer } from '../app/[locale]/utils/pointer'

function elementAt(rect: Partial<DOMRect>) {
  const el = document.createElement('div')
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0, ...rect }) as DOMRect
  return el
}

function pointerEvent(el: HTMLElement, clientX = 0, clientY = 0) {
  return { currentTarget: el, clientX, clientY } as unknown as PointerEvent<HTMLElement>
}

describe('trackPointer', () => {
  test('publishes the pointer position as CSS variables', () => {
    const el = elementAt({ left: 100, top: 0, width: 200, height: 100 })

    trackPointer(pointerEvent(el, 150, 50))

    // Un quart de la largeur, moitié de la hauteur.
    expect(el.style.getPropertyValue('--mx')).toBe('25.00%')
    expect(el.style.getPropertyValue('--my')).toBe('50.00%')
    expect(el.style.getPropertyValue('--px')).toBe('-0.500')
    expect(el.style.getPropertyValue('--py')).toBe('0.000')
  })

  test('ignores an element that has no size', () => {
    const el = elementAt({ width: 0, height: 0 })

    trackPointer(pointerEvent(el, 10, 10))

    expect(el.style.getPropertyValue('--mx')).toBe('')
  })
})

describe('resetPointer', () => {
  test('puts the element back at rest', () => {
    const el = elementAt({ width: 200, height: 100 })
    trackPointer(pointerEvent(el, 200, 100))

    resetPointer(pointerEvent(el))

    expect(el.style.getPropertyValue('--px')).toBe('0')
    expect(el.style.getPropertyValue('--py')).toBe('0')
  })
})
