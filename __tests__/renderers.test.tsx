import { render } from '@testing-library/react'
import { renderStrong, makeSpanRenderer } from '../app/[locale]/utils/renderers'

describe('renderStrong', () => {
  test('wraps content in a <strong> element', () => {
    const { container } = render(<>{renderStrong('hello')}</>)
    expect(container.querySelector('strong')).toHaveTextContent('hello')
  })

  test('renders ReactNode children', () => {
    const { container } = render(<>{renderStrong(<em>italic</em>)}</>)
    expect(container.querySelector('strong > em')).toBeInTheDocument()
  })
})

describe('makeSpanRenderer', () => {
  test('returns a function that wraps content in a <span>', () => {
    const renderer = makeSpanRenderer('highlight')
    const { container } = render(<>{renderer('world')}</>)
    const span = container.querySelector('span')
    expect(span).toHaveTextContent('world')
    expect(span).toHaveClass('highlight')
  })

  test('each instance uses its own className', () => {
    const r1 = makeSpanRenderer('class-a')
    const r2 = makeSpanRenderer('class-b')
    const { container: c1 } = render(<>{r1('text')}</>)
    const { container: c2 } = render(<>{r2('text')}</>)
    expect(c1.querySelector('span')).toHaveClass('class-a')
    expect(c2.querySelector('span')).toHaveClass('class-b')
  })
})
