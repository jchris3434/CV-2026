import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../app/[locale]/Components/Navbar/navbar'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('react-scroll', () => ({
  Link: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <a onClick={onClick}>{children}</a>
  ),
}))

vi.mock('next/font/google', () => ({
  Funnel_Sans: () => ({ className: 'funnel-sans' }),
  Roboto_Mono: () => ({ className: 'roboto-mono' }),
}))

vi.mock('../app/[locale]/Components/LocaleSelect/LocaleSelect', () => ({
  default: () => <div data-testid="locale-select" />,
}))

describe('Navbar', () => {
  test('renders the header with locale selector', () => {
    render(<Navbar />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByTestId('locale-select')).toBeInTheDocument()
  })

  test('renders the hamburger button', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  test('renders all navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('navbar.about')).toBeInTheDocument()
    expect(screen.getByText('navbar.tools')).toBeInTheDocument()
    expect(screen.getByText('navbar.projects')).toBeInTheDocument()
    expect(screen.getByText('navbar.contact')).toBeInTheDocument()
  })

  test('toggles mobile menu open and closed on hamburger click', () => {
    render(<Navbar />)
    const hamburger = screen.getByRole('button', { name: 'Menu' })

    fireEvent.click(hamburger)
    const nav = document.querySelector('nav')
    expect(nav?.className).toContain('navOpen')

    fireEvent.click(hamburger)
    expect(nav?.className).not.toContain('navOpen')
  })
})
