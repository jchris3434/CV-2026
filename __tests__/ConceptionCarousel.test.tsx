import { act, fireEvent, render, screen } from '@testing-library/react'
import Conception from '../app/[locale]/Components/Conception/conception'

// Faux carrousel Embla : le test décide quel diagramme est affiché.
const embla = vi.hoisted(() => {
  const handlers: Record<string, () => void> = {}
  const api = {
    on: vi.fn((event: string, handler: () => void) => {
      handlers[event] = handler
    }),
    off: vi.fn(),
    selectedScrollSnap: vi.fn(() => 0),
    scrollTo: vi.fn(),
  }
  return { api, handlers }
})

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), embla.api],
}))

vi.mock('embla-carousel-autoplay', () => ({
  default: () => null,
}))

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

// Les modules CSS donnent des noms de classe du type « _counter_1a2b3c ».
function counter(container: HTMLElement) {
  return container.querySelector('[class*="_counter_"]')
}

function dot(position: number) {
  return screen.getByRole('button', { name: `Diagramme UML ${position}` })
}

afterEach(() => {
  vi.clearAllMocks()
  embla.api.selectedScrollSnap.mockReturnValue(0)
})

describe('Conception carousel', () => {
  test('starts on the first diagram', () => {
    const { container } = render(<Conception />)

    expect(dot(1)).toHaveAttribute('aria-current', 'true')
    expect(dot(2)).not.toHaveAttribute('aria-current')
    expect(counter(container)).toHaveTextContent(/^01 \/ \d{2}$/)
  })

  test('jumps to a diagram when its dot is clicked', () => {
    render(<Conception />)

    fireEvent.click(dot(3))

    expect(embla.api.scrollTo).toHaveBeenCalledWith(2)
  })

  test('follows the diagram on screen', () => {
    const { container } = render(<Conception />)

    embla.api.selectedScrollSnap.mockReturnValue(4)
    act(() => embla.handlers.select())

    expect(dot(5)).toHaveAttribute('aria-current', 'true')
    expect(dot(1)).not.toHaveAttribute('aria-current')
    expect(counter(container)).toHaveTextContent(/^05 \/ \d{2}$/)
  })

  test('stops listening to the carousel once removed from the page', () => {
    const { unmount } = render(<Conception />)

    unmount()

    expect(embla.api.off).toHaveBeenCalledWith('select', embla.handlers.select)
  })
})
