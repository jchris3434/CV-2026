import { render, screen } from '@testing-library/react'
import Reveal from '../app/[locale]/Components/Reveal/reveal'

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void

// Faux IntersectionObserver : le test décide quand l'élément entre dans l'écran.
function stubIntersectionObserver() {
  const observers: { callback: ObserverCallback; disconnect: ReturnType<typeof vi.fn> }[] = []

  class FakeObserver {
    readonly disconnect = vi.fn()
    readonly observe = vi.fn()

    constructor(callback: ObserverCallback) {
      observers.push({ callback, disconnect: this.disconnect })
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return observers
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Reveal', () => {
  test('shows its content at once when the browser cannot observe', () => {
    render(<Reveal>content</Reveal>)

    expect(screen.getByText('content').dataset.revealed).toBe('true')
  })

  test('exposes the variant, the delay and the class name', () => {
    render(
      <Reveal variant="zoom" delay={160} className="box">
        content
      </Reveal>,
    )
    const el = screen.getByText('content')

    expect(el.dataset.reveal).toBe('zoom')
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('160ms')
    expect(el).toHaveClass('box')
  })

  test('slides up without delay by default', () => {
    render(<Reveal>content</Reveal>)
    const el = screen.getByText('content')

    expect(el.dataset.reveal).toBe('up')
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('0ms')
  })

  test('waits for the content to enter the screen, then stops observing', () => {
    const observers = stubIntersectionObserver()
    render(<Reveal>content</Reveal>)
    const el = screen.getByText('content')
    const [{ callback, disconnect }] = observers

    callback([{ isIntersecting: false }])
    expect(el.dataset.revealed).toBeUndefined()
    expect(disconnect).not.toHaveBeenCalled()

    callback([{ isIntersecting: true }])
    expect(el.dataset.revealed).toBe('true')
    expect(disconnect).toHaveBeenCalled()
  })

  test('stops observing when it leaves the page', () => {
    const observers = stubIntersectionObserver()
    const { unmount } = render(<Reveal>content</Reveal>)

    unmount()

    expect(observers[0].disconnect).toHaveBeenCalled()
  })
})
