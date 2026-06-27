import { render, screen } from '@testing-library/react'
import FrontEnd from '../app/[locale]/Components/FrontEnd/frontend'

vi.mock('../app/[locale]/Components/BackEnd/ToolsSection', () => ({
  default: ({ titleKey, reverse }: { titleKey: string; reverse?: boolean }) => (
    <div data-testid="tools-section" data-title={titleKey} data-reverse={String(!!reverse)} />
  ),
}))

describe('FrontEnd', () => {
  test('renders ToolsSection with frontend title key and reverse prop', () => {
    render(<FrontEnd />)
    const section = screen.getByTestId('tools-section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('data-title', 'frontendTitle')
    expect(section).toHaveAttribute('data-reverse', 'true')
  })
})
