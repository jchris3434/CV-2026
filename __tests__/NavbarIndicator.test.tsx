import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import Navbar from '../app/[locale]/Components/Navbar/navbar'

type LinkProps = {
  readonly to: string
  readonly children: ReactNode
  readonly onClick?: () => void
  readonly onSetActive?: (to: string) => void
  readonly onSetInactive?: (to: string) => void
}

// Les liens gardés de côté : le test joue le rôle de react-scroll, qui prévient
// la barre quand une section entre dans l'écran ou en sort.
const links = vi.hoisted(() => ({}) as Record<string, LinkProps>)

vi.mock('react-scroll', () => ({
  Link: (props: LinkProps) => {
    links[props.to] = props
    return <a onClick={props.onClick}>{props.children}</a>
  },
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('../app/[locale]/Components/LocaleSelect/LocaleSelect', () => ({
  default: () => <div data-testid="locale-select" />,
}))

function stubLinkBox(left: number, width: number) {
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockReturnValue(left)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width)
}

function renderNavbar() {
  const { container } = render(<Navbar />)
  return container.querySelector('ul') as HTMLUListElement
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Navbar highlight', () => {
  test('slides under the link of the section on screen', () => {
    stubLinkBox(120, 96)
    const list = renderNavbar()

    expect(list.dataset.active).toBeUndefined()

    act(() => links.projects.onSetActive?.('projects'))

    expect(list.dataset.active).toBe('true')
    expect(list.style.getPropertyValue('--indicator-x')).toBe('120px')
    expect(list.style.getPropertyValue('--indicator-width')).toBe('96px')
  })

  test('disappears when its section leaves the screen', () => {
    const list = renderNavbar()
    act(() => links.projects.onSetActive?.('projects'))

    // Une autre section qui sort de l'écran ne change rien.
    act(() => links.tools.onSetInactive?.('tools'))
    expect(list.dataset.active).toBe('true')

    act(() => links.projects.onSetInactive?.('projects'))
    expect(list.dataset.active).toBeUndefined()
  })

  test('is realigned when the window is resized', () => {
    stubLinkBox(120, 96)
    const list = renderNavbar()
    act(() => links.contact.onSetActive?.('contact'))

    stubLinkBox(80, 70)
    fireEvent(globalThis.window, new Event('resize'))

    expect(list.style.getPropertyValue('--indicator-x')).toBe('80px')
    expect(list.style.getPropertyValue('--indicator-width')).toBe('70px')
  })
})

describe('Navbar mobile menu', () => {
  test('blocks the page scroll while it is open', () => {
    render(<Navbar />)
    const root = document.documentElement

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    expect(root.style.overflow).toBe('hidden')

    fireEvent.click(screen.getByText('navbar.projects'))
    expect(root.style.overflow).toBe('')
    expect(document.querySelector('nav')?.className).not.toContain('navOpen')
  })
})
