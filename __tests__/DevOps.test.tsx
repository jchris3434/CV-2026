import { render, screen } from '@testing-library/react'
import DevOps from '../app/[locale]/Components/DevOps/devops'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

let mockIO: ReturnType<typeof vi.fn>

beforeEach(() => {
  // Must be a regular function (not arrow) to be usable as a constructor with `new`
  mockIO = vi.fn(function (this: object) {
    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
  })
  vi.stubGlobal('IntersectionObserver', mockIO)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('DevOps', () => {
  test('renders section titles', () => {
    render(<DevOps />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('devopsTitle')).toBeInTheDocument()
  })

  test('renders all four DevOps pillars', () => {
    render(<DevOps />)
    expect(screen.getByText('devopsPillars.qualitySecurity.title')).toBeInTheDocument()
    expect(screen.getByText('devopsPillars.ciCd.title')).toBeInTheDocument()
    expect(screen.getByText('devopsPillars.monitoring.title')).toBeInTheDocument()
    expect(screen.getByText('devopsPillars.architecture.title')).toBeInTheDocument()
  })

  test('renders tech logos for each pillar', () => {
    render(<DevOps />)
    const logos = screen.getAllByAltText('tech logo')
    // qualitySecurity(2) + ciCd(2) + monitoring(3) + architecture(2) = 9
    expect(logos).toHaveLength(9)
  })

  test('creates IntersectionObserver when viewport is mobile (<= 900px)', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true, writable: true })
    render(<DevOps />)
    expect(mockIO).toHaveBeenCalled()
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true, writable: true })
  })

  test('lights up the most visible card on a small screen', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true, writable: true })
    const { container } = render(<DevOps />)
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true, writable: true })

    // Les apparitions au défilement créent aussi des observateurs : celui des
    // cartes est le seul à surveiller plusieurs seuils.
    const [onIntersect] = mockIO.mock.calls.find(([, options]) => Array.isArray(options?.threshold)) ?? []
    // Les modules CSS donnent des noms de classe du type « _card_1a2b3c ».
    const [first, second] = container.querySelectorAll('[class*="_card_"]')

    onIntersect([
      { target: first, isIntersecting: true, intersectionRatio: 0.4 },
      { target: second, isIntersecting: true, intersectionRatio: 0.9 },
    ])
    expect(first.className).not.toContain('activeCard')
    expect(second.className).toContain('activeCard')

    onIntersect([{ target: second, isIntersecting: false, intersectionRatio: 0.2 }])
    expect(first.className).toContain('activeCard')
    expect(second.className).not.toContain('activeCard')
  })
})
