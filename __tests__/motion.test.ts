import {
  hasFinePointer,
  prefersReducedMotion,
  runViewTransition,
} from '../app/[locale]/utils/motion'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FINE_POINTER = '(pointer: fine)'

function stubMatchMedia(...matching: string[]) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: matching.includes(query) }))
}

// Faux `document.startViewTransition` : applique la mise à jour tout de suite,
// et laisse le test décider quand la transition se termine.
function stubViewTransitions() {
  const endings: { finish: () => void; fail: () => void }[] = []
  const start = vi.fn((update: () => void) => {
    update()
    const finished = new Promise<void>((resolve, reject) => {
      endings.push({ finish: resolve, fail: () => reject(new Error('skipped')) })
    })
    return { finished }
  })
  Object.defineProperty(document, 'startViewTransition', { value: start, configurable: true })
  return { start, endings }
}

afterEach(() => {
  vi.unstubAllGlobals()
  delete (document as { startViewTransition?: unknown }).startViewTransition
  delete document.documentElement.dataset.probe
})

describe('media queries', () => {
  test('answer false when the browser cannot tell', () => {
    expect(prefersReducedMotion()).toBe(false)
    expect(hasFinePointer()).toBe(false)
  })

  test('follow the visitor settings', () => {
    stubMatchMedia(REDUCED_MOTION)
    expect(prefersReducedMotion()).toBe(true)
    expect(hasFinePointer()).toBe(false)

    stubMatchMedia(FINE_POINTER)
    expect(prefersReducedMotion()).toBe(false)
    expect(hasFinePointer()).toBe(true)
  })
})

describe('runViewTransition', () => {
  test('applies the update at once when view transitions are missing', () => {
    const update = vi.fn()

    expect(runViewTransition(update, 'probe')).toBeNull()
    expect(update).toHaveBeenCalledTimes(1)
    expect(document.documentElement.dataset.probe).toBeUndefined()
  })

  test('applies the update at once when the visitor limits animations', () => {
    const { start } = stubViewTransitions()
    stubMatchMedia(REDUCED_MOTION)
    const update = vi.fn()

    expect(runViewTransition(update, 'probe')).toBeNull()
    expect(update).toHaveBeenCalledTimes(1)
    expect(start).not.toHaveBeenCalled()
  })

  test('marks <html> for the duration of the transition', async () => {
    const { start, endings } = stubViewTransitions()
    const update = vi.fn()

    const transition = runViewTransition(update, 'probe')

    expect(transition).not.toBeNull()
    expect(start).toHaveBeenCalledWith(update)
    expect(update).toHaveBeenCalledTimes(1)
    expect(document.documentElement.dataset.probe).toBeDefined()

    endings[0].finish()
    await vi.waitFor(() => expect(document.documentElement.dataset.probe).toBeUndefined())
  })

  test('clears the marker when the transition is interrupted', async () => {
    const { endings } = stubViewTransitions()

    runViewTransition(vi.fn(), 'probe')
    endings[0].fail()

    await vi.waitFor(() => expect(document.documentElement.dataset.probe).toBeUndefined())
  })

  test('keeps the marker of a newer transition', async () => {
    const { endings } = stubViewTransitions()

    runViewTransition(vi.fn(), 'probe')
    runViewTransition(vi.fn(), 'probe')
    const second = document.documentElement.dataset.probe

    // La première se termine pendant que la seconde tourne encore.
    endings[0].finish()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.documentElement.dataset.probe).toBe(second)

    endings[1].finish()
    await vi.waitFor(() => expect(document.documentElement.dataset.probe).toBeUndefined())
  })
})
