import { render, screen } from '@testing-library/react'
import Welcome from '../app/[locale]/Components/Welcome/welcome'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign(
    (key: string) => key,
    { rich: (key: string) => key }
  ),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

vi.mock('next/font/google', () => ({
  Roboto_Mono: () => ({ className: 'roboto-mono' }),
}))

describe('Welcome', () => {
  test('renders the profile image', () => {
    render(<Welcome />)
    expect(screen.getByAltText('Picture of the author')).toBeInTheDocument()
  })

  test('renders the name heading', () => {
    render(<Welcome />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('renders the section wrapper', () => {
    const { container } = render(<Welcome />)
    expect(container.querySelector('section')).toBeInTheDocument()
  })
})
