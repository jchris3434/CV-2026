import { render, screen } from '@testing-library/react'
import BackEnd from '../app/[locale]/Components/BackEnd/backend'

vi.mock('../app/[locale]/Components/BackEnd/ToolsSection', () => ({
  default: ({ titleKey }: { titleKey: string }) => (
    <div data-testid="tools-section" data-title={titleKey} />
  ),
}))

describe('BackEnd', () => {
  test('renders ToolsSection with backend title key', () => {
    render(<BackEnd />)
    const section = screen.getByTestId('tools-section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('data-title', 'backendTitle')
  })
})
