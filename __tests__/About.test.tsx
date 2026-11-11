import { render, screen } from '@testing-library/react'
import AboutMe from '../app/[locale]/Components/AboutMe/about'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

describe('AboutMe', () => {
  test('renders the section and heading', () => {
    render(<AboutMe />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('has no picture, the portrait is already in the banner', () => {
    render(<AboutMe />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('renders biography paragraphs', () => {
    render(<AboutMe />)
    const paragraphs = document.querySelectorAll('p')
    expect(paragraphs.length).toBeGreaterThanOrEqual(4)
  })
})
