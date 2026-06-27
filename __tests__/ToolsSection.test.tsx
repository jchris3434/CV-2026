import { render, screen } from '@testing-library/react'
import ToolsSection from '../app/[locale]/Components/BackEnd/ToolsSection'

vi.mock('next-intl', () => ({
  useTranslations: () => Object.assign((key: string) => key, { rich: (key: string) => key }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const images = [{ src: '/a.png' }, { src: '/b.png' }, { src: '/c.png' }]

describe('ToolsSection', () => {
  test('renders the section title and sub-title', () => {
    render(
      <ToolsSection titleKey="backendTitle" descriptionPrefix="backendDescription"
        stepCount={2} images={images} altPrefix="logo" />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('backendTitle')).toBeInTheDocument()
  })

  test('renders the correct number of description paragraphs', () => {
    render(
      <ToolsSection titleKey="backendTitle" descriptionPrefix="bd"
        stepCount={3} images={images} altPrefix="logo" />
    )
    expect(screen.getByText('bd.step1')).toBeInTheDocument()
    expect(screen.getByText('bd.step2')).toBeInTheDocument()
    expect(screen.getByText('bd.step3')).toBeInTheDocument()
  })

  test('doubles the images array for the marquee', () => {
    render(
      <ToolsSection titleKey="t" descriptionPrefix="d"
        stepCount={1} images={images} altPrefix="icon" />
    )
    // 3 images × 2 = 6 in the DOM
    expect(screen.getAllByRole('img')).toHaveLength(6)
  })

  test('applies the altPrefix to each image alt text', () => {
    render(
      <ToolsSection titleKey="t" descriptionPrefix="d"
        stepCount={1} images={[{ src: '/x.png' }]} altPrefix="logo tech" />
    )
    // 1 image × 2 (doubled) = 2 — both should use the altPrefix
    expect(screen.getByAltText('logo tech 1')).toBeInTheDocument()
    expect(screen.getByAltText('logo tech 2')).toBeInTheDocument()
  })
})
