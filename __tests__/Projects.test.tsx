import { render, screen, fireEvent } from '@testing-library/react'
import Projects from '../app/[locale]/Components/Projects/projects'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: {
    src: string; alt: string; width?: number; height?: number; className?: string
  }) => <img src={src} alt={alt} width={width} height={height} className={className} />,
}))

describe('Projects', () => {
  test('renders the section heading and all project cards', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    // 10 project thumbnails + the « more projects » toggle → 11 buttons
    expect(screen.getAllByRole('button')).toHaveLength(11)
  })

  test('keeps the four oldest projects folded until the toggle is used', () => {
    const { container } = render(<Projects />)
    const toggle = screen.getByRole('button', { name: 'more' })
    const folded = container.querySelector('[inert]')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(folded?.querySelectorAll('article')).toHaveLength(4)

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'less' })).toHaveAttribute('aria-expanded', 'true')
    expect(container.querySelector('[inert]')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'less' }))
    expect(container.querySelector('[inert]')).not.toBeNull()
  })

  test('opens a modal when a project card is clicked', () => {
    render(<Projects />)
    expect(document.querySelector('video')).toBeNull()

    fireEvent.click(screen.getAllByRole('button')[0])

    expect(document.querySelector('video')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  test('closes the modal when the close button is clicked', () => {
    render(<Projects />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(document.querySelector('video')).not.toBeNull()

    // Close button is the last button rendered when the modal is open
    const allButtons = screen.getAllByRole('button')
    fireEvent.click(allButtons[allButtons.length - 1])

    expect(document.querySelector('video')).toBeNull()
  })
})
