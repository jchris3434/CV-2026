import { render, screen } from '@testing-library/react'
import Step from '../app/[locale]/Components/Step/step'

describe('Step', () => {
  test('renders the title, the eyebrow and the content', () => {
    render(
      <Step number={2} eyebrow="reminder" title="Back-end">
        <p>content</p>
      </Step>,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Back-end' })).toBeInTheDocument()
    expect(screen.getByText('reminder')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  test('shows the step number on two digits', () => {
    const { container } = render(
      <Step number={3} title="Front-end">
        content
      </Step>,
    )

    expect(screen.getByText('03')).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-step', '3')
  })

  test('leaves out the number and the eyebrow when they are not given', () => {
    const { container } = render(<Step title="Conception">content</Step>)

    expect(container.querySelector('header')?.children).toHaveLength(1)
    expect(container.firstElementChild).not.toHaveAttribute('data-step')
  })
})
