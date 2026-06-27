import { render, screen, fireEvent } from '@testing-library/react'
import LocaleSelect from '../app/[locale]/Components/LocaleSelect/LocaleSelect'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/fr',
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: {
    src: string; alt: string; width?: number; height?: number; className?: string
  }) => <img src={src} alt={alt} width={width} height={height} className={className} />,
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe('LocaleSelect', () => {
  test('renders English and French flag buttons', () => {
    render(<LocaleSelect />)
    expect(screen.getByAltText('English')).toBeInTheDocument()
    expect(screen.getByAltText('Français')).toBeInTheDocument()
  })

  test('navigates to English locale on EN click', () => {
    render(<LocaleSelect />)
    fireEvent.click(screen.getByAltText('English').closest('button')!)
    expect(mockPush).toHaveBeenCalledWith('/en')
  })

  test('navigates to French locale on FR click', () => {
    render(<LocaleSelect />)
    fireEvent.click(screen.getByAltText('Français').closest('button')!)
    expect(mockPush).toHaveBeenCalledWith('/fr')
  })
})
