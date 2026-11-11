import { fireEvent, render } from '@testing-library/react'
import CursorGlow from '../app/[locale]/Components/CursorGlow/cursorglow'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FINE_POINTER = '(pointer: fine)'

function stubMatchMedia(...matching: string[]) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: matching.includes(query) }))
}

// L'image suivante est jouée tout de suite : l'effet se vérifie sans attendre.
function stubAnimationFrame() {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
}

function renderGlow() {
  const { container, unmount } = render(<CursorGlow />)
  return { glow: container.firstElementChild as HTMLElement, unmount }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('CursorGlow', () => {
  test('is hidden from assistive technologies', () => {
    const { glow } = renderGlow()

    expect(glow).toHaveAttribute('aria-hidden', 'true')
  })

  test('follows the mouse', () => {
    stubMatchMedia(FINE_POINTER)
    stubAnimationFrame()
    const { glow } = renderGlow()

    fireEvent.pointerMove(globalThis.window, { clientX: 120, clientY: 45 })

    expect(glow.style.getPropertyValue('--x')).toBe('120px')
    expect(glow.style.getPropertyValue('--y')).toBe('45px')
    expect(glow.dataset.active).toBe('true')
  })

  test('stays off on a touch screen', () => {
    stubMatchMedia()
    stubAnimationFrame()
    const { glow } = renderGlow()

    fireEvent.pointerMove(globalThis.window, { clientX: 120, clientY: 45 })

    expect(glow.dataset.active).toBeUndefined()
  })

  test('stays off when the visitor limits animations', () => {
    stubMatchMedia(FINE_POINTER, REDUCED_MOTION)
    stubAnimationFrame()
    const { glow } = renderGlow()

    fireEvent.pointerMove(globalThis.window, { clientX: 120, clientY: 45 })

    expect(glow.dataset.active).toBeUndefined()
  })

  test('stops following once removed from the page', () => {
    stubMatchMedia(FINE_POINTER)
    stubAnimationFrame()
    const { glow, unmount } = renderGlow()

    unmount()
    fireEvent.pointerMove(globalThis.window, { clientX: 120, clientY: 45 })

    expect(glow.dataset.active).toBeUndefined()
  })
})
