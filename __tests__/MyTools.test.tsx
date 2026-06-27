import { render, screen } from '@testing-library/react'
import MyTools from '../app/[locale]/Components/MyTools/mytools'

vi.mock('../app/[locale]/Components/Conception/conception', () => ({
  default: () => <div data-testid="conception" />,
}))
vi.mock('../app/[locale]/Components/BackEnd/backend', () => ({
  default: () => <div data-testid="backend" />,
}))
vi.mock('../app/[locale]/Components/FrontEnd/frontend', () => ({
  default: () => <div data-testid="frontend" />,
}))
vi.mock('../app/[locale]/Components/DevOps/devops', () => ({
  default: () => <div data-testid="devops" />,
}))

describe('MyTools', () => {
  test('renders all four tool sub-sections', () => {
    render(<MyTools />)
    expect(screen.getByTestId('conception')).toBeInTheDocument()
    expect(screen.getByTestId('backend')).toBeInTheDocument()
    expect(screen.getByTestId('frontend')).toBeInTheDocument()
    expect(screen.getByTestId('devops')).toBeInTheDocument()
  })

  test('wraps sub-sections in a tools section', () => {
    const { container } = render(<MyTools />)
    expect(container.querySelector('#tools')).toBeInTheDocument()
  })
})
