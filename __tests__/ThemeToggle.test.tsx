import { fireEvent, render, screen } from '@testing-library/react'
import ThemeToggle from '../app/[locale]/Components/ThemeToggle/themetoggle'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const root = document.documentElement

// Faux `document.startViewTransition` : applique le thème tout de suite et
// laisse le test dire si la transition a pu démarrer.
function stubViewTransitions(ready: Promise<void>) {
  const start = vi.fn((update: () => void) => {
    update()
    return { ready, finished: Promise.resolve() }
  })
  Object.defineProperty(document, 'startViewTransition', { value: start, configurable: true })
  return start
}

function clickToggle() {
  fireEvent.click(screen.getByRole('button', { name: 'theme' }))
}

afterEach(() => {
  vi.restoreAllMocks()
  delete (document as { startViewTransition?: unknown }).startViewTransition
  delete (root as { animate?: unknown }).animate
  delete root.dataset.theme
  delete root.dataset.themeSwitch
  localStorage.clear()
})

describe('ThemeToggle', () => {
  test('switches from night to day, then back, and remembers the choice', () => {
    render(<ThemeToggle />)

    clickToggle()
    expect(root.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')

    clickToggle()
    expect(root.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  test('still switches when the choice cannot be stored', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })
    render(<ThemeToggle />)

    clickToggle()

    expect(root.dataset.theme).toBe('light')
  })

  test('opens the new theme in a circle centred on the button', async () => {
    const start = stubViewTransitions(Promise.resolve())
    const animate = vi.fn()
    Object.defineProperty(root, 'animate', { value: animate, configurable: true })
    render(<ThemeToggle />)

    clickToggle()

    expect(start).toHaveBeenCalledTimes(1)
    expect(root.dataset.theme).toBe('light')
    await vi.waitFor(() => expect(animate).toHaveBeenCalledTimes(1))

    const [keyframes, options] = animate.mock.calls[0]
    expect(keyframes.clipPath[0]).toBe('circle(0px at 0px 0px)')
    expect(options.pseudoElement).toBe('::view-transition-new(root)')
  })

  test('keeps the new theme when the transition is interrupted', async () => {
    stubViewTransitions(Promise.reject(new Error('skipped')))
    const animate = vi.fn()
    Object.defineProperty(root, 'animate', { value: animate, configurable: true })
    render(<ThemeToggle />)

    clickToggle()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(root.dataset.theme).toBe('light')
    expect(animate).not.toHaveBeenCalled()
  })
})
