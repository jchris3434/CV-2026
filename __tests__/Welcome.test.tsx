import { act, render, screen } from '@testing-library/react'
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

  test('types the job titles one after the other', () => {
    vi.useFakeTimers()
    const { container } = render(<Welcome />)
    // Les modules CSS donnent des noms de classe du type « _typed_1a2b3c ».
    const typed = () => container.querySelector('[class*="_typed_"]')?.textContent
    // Le temps avance par petits pas, pour laisser React réagir entre deux.
    const wait = (ms: number) => {
      for (let elapsed = 0; elapsed < ms; elapsed += 100) {
        act(() => {
          vi.advanceTimersByTime(100)
        })
      }
    }

    expect(typed()).toBe('')

    wait(1500)
    expect(typed()).toBe('fullstack')

    wait(4000)
    expect(typed()).toBe('jobTitle2')

    vi.useRealTimers()
  })
})
