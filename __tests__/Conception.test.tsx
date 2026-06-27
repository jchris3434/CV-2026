import { render, screen } from '@testing-library/react'
import Conception from '../app/[locale]/Components/Conception/conception'

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn(), null],
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

describe('Conception', () => {
  test('renders the section title', () => {
    render(<Conception />)
    expect(screen.getByText('conceptionTitle')).toBeInTheDocument()
  })

  test('renders all carousel images', () => {
    render(<Conception />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(7)
  })

  test('renders description paragraphs', () => {
    render(<Conception />)
    expect(screen.getByText('conceptionDescription.step1')).toBeInTheDocument()
    expect(screen.getByText('conceptionDescription.step4')).toBeInTheDocument()
  })
})
