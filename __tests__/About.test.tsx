import { render, screen } from '@testing-library/react'
import AboutMe from '../app/[locale]/Components/AboutMe/about'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

describe('AboutMe', () => {
  test('renders the section and heading', () => {
    render(<AboutMe />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('renders the profile image', () => {
    render(<AboutMe />)
    expect(screen.getByAltText('Picture of the author')).toBeInTheDocument()
  })

  test('renders biography paragraphs', () => {
    render(<AboutMe />)
    const paragraphs = document.querySelectorAll('p')
    expect(paragraphs.length).toBeGreaterThanOrEqual(4)
  })
})
