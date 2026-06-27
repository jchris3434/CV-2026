import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Contact from '../app/[locale]/Components/Contact/contact'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('Contact', () => {
  test('renders heading, social links, and form fields', () => {
    render(<Contact />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByAltText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByAltText('GitHub')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('placeholders.name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('placeholders.email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('placeholders.message')).toBeInTheDocument()
  })

  test('updates form fields on user input', () => {
    render(<Contact />)
    const nameInput = screen.getByPlaceholderText('placeholders.name') as HTMLInputElement

    fireEvent.change(nameInput, { target: { value: 'Jean', name: 'name' } })
    expect(nameInput.value).toBe('Jean')
  })

  test('shows thank-you message after successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    render(<Contact />)

    fireEvent.change(screen.getByPlaceholderText('placeholders.name'), {
      target: { value: 'Jean', name: 'name' },
    })
    fireEvent.change(screen.getByPlaceholderText('placeholders.email'), {
      target: { value: 'jean@example.com', name: 'email' },
    })
    fireEvent.change(screen.getByPlaceholderText('placeholders.message'), {
      target: { value: 'Bonjour', name: 'message' },
    })
    fireEvent.submit(screen.getByRole('button', { name: 'buttons.submit' }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('thankYou')).toBeInTheDocument()
    })
  })

  test('disables submit button while loading', async () => {
    let resolveRequest!: (value: { ok: boolean }) => void
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(
      new Promise(resolve => { resolveRequest = resolve })
    ))
    render(<Contact />)

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'buttons.submit' }).closest('form')!)
    })

    expect(screen.getByRole('button', { name: 'buttons.loading' })).toBeDisabled()

    await act(async () => { resolveRequest({ ok: false }) })
  })
})
