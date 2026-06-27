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
})
