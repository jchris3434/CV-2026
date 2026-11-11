import { fireEvent, render } from '@testing-library/react'
import TopoCanvas from '../app/[locale]/Components/TopoCanvas/topocanvas'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function stubMatchMedia(...matching: string[]) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: matching.includes(query) }))
}

// Faux contexte 2D : jsdom n'en fournit pas.
function stubCanvas() {
  const ctx = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  )
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 360, 180),
  )
  return ctx
}

// Les images demandées sont gardées de côté : le test les joue quand il veut.
function stubAnimationFrame() {
  const frames: FrameRequestCallback[] = []
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
  const cancel = vi.fn()
  vi.stubGlobal('cancelAnimationFrame', cancel)
  return { cancel, play: (time: number) => frames.at(-1)?.(time) }
}

function stubIntersectionObserver() {
  const observers: { callback: (entries: { isIntersecting: boolean }[]) => void }[] = []

  class FakeObserver {
    readonly observe = vi.fn()
    readonly disconnect = vi.fn()

    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
      observers.push({ callback })
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return observers
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.theme
})

describe('TopoCanvas', () => {
  test('renders a decorative canvas, even without a drawing context', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(<TopoCanvas />)

    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true')
  })

  test('sizes the canvas on its box and draws the dots', () => {
    const ctx = stubCanvas()
    const { play } = stubAnimationFrame()
    const { container } = render(<TopoCanvas />)
    const canvas = container.querySelector('canvas')

    expect(canvas?.width).toBe(360)
    expect(canvas?.height).toBe(180)
    expect(ctx.fill).not.toHaveBeenCalled()

    play(1000)

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 360, 180)
    expect(ctx.fill).toHaveBeenCalled()
    expect(ctx.fillStyle).toMatch(/^rgba\(/)
  })

  test('draws at most one frame every 33 ms', () => {
    const ctx = stubCanvas()
    const { play } = stubAnimationFrame()
    render(<TopoCanvas />)

    play(1000)
    play(1010)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)

    play(1040)
    expect(ctx.clearRect).toHaveBeenCalledTimes(2)
  })

  test('pauses while the banner is off screen', () => {
    const ctx = stubCanvas()
    const { play } = stubAnimationFrame()
    const observers = stubIntersectionObserver()
    render(<TopoCanvas />)

    observers[0].callback([{ isIntersecting: false }])
    play(1000)
    expect(ctx.clearRect).not.toHaveBeenCalled()

    observers[0].callback([{ isIntersecting: true }])
    play(2000)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
  })

  test('lifts the relief under the pointer', () => {
    const ctx = stubCanvas()
    const { play } = stubAnimationFrame()

    // Même instant, même relief de départ : seule la position du pointeur change.
    const drawAt = (pointer?: { clientX: number; clientY: number }) => {
      const { unmount } = render(<TopoCanvas />)
      if (pointer) fireEvent.pointerMove(globalThis.window, pointer)
      ctx.arc.mockClear()
      play(1000)
      unmount()
      return ctx.arc.mock.calls.map((call) => call[2])
    }

    const flat = drawAt()

    expect(flat.length).toBeGreaterThan(0)
    expect(drawAt()).toEqual(flat)
    expect(drawAt({ clientX: 180, clientY: 90 })).not.toEqual(flat)
    // Pointeur sous le bandeau : le relief reste au repos.
    expect(drawAt({ clientX: 180, clientY: 400 })).toEqual(flat)
  })

  test('draws a single still image when the visitor limits animations', () => {
    stubMatchMedia(REDUCED_MOTION)
    const ctx = stubCanvas()
    const { play } = stubAnimationFrame()
    render(<TopoCanvas />)

    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    expect(play(1000)).toBeUndefined()
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)

    fireEvent(globalThis.window, new Event('resize'))
    expect(ctx.clearRect).toHaveBeenCalledTimes(2)
  })

  test('redraws the still image when the theme changes', async () => {
    stubMatchMedia(REDUCED_MOTION)
    const ctx = stubCanvas()
    stubAnimationFrame()
    render(<TopoCanvas />)

    document.documentElement.dataset.theme = 'light'

    await vi.waitFor(() => expect(ctx.clearRect).toHaveBeenCalledTimes(2))
  })

  test('stops everything once removed from the page', () => {
    const ctx = stubCanvas()
    const { cancel } = stubAnimationFrame()
    const { unmount } = render(<TopoCanvas />)

    unmount()
    fireEvent(globalThis.window, new Event('resize'))

    expect(cancel).toHaveBeenCalled()
    expect(ctx.setTransform).toHaveBeenCalledTimes(1)
  })
})
