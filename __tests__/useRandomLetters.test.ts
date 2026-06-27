import { renderHook, act } from '@testing-library/react'
import { useRandomLetters } from '../app/[locale]/Hooks/useRandomLetters'

afterEach(() => {
  vi.useRealTimers()
})

describe('useRandomLetters', () => {
  test('returns the original text unchanged', () => {
    const { result } = renderHook(() => useRandomLetters('Hello'))
    expect(result.current.text).toBe('Hello')
  })

  test('starts with all letters hidden and isDone false', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRandomLetters('AB', 100))
    expect(result.current.visibility).toEqual([0, 0])
    expect(result.current.isDone).toBe(false)
  })

  test('reveals all letters and sets isDone after timers complete', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRandomLetters('AB', 10))

    await act(async () => { vi.runAllTimers() })

    expect(result.current.visibility.every(v => v === 1)).toBe(true)
    expect(result.current.isDone).toBe(true)
  })

  test('resets visibility when text changes', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ text }: { text: string }) => useRandomLetters(text, 10),
      { initialProps: { text: 'AB' } }
    )
    await act(async () => { vi.runAllTimers() })
    expect(result.current.isDone).toBe(true)

    rerender({ text: 'XYZ' })
    expect(result.current.visibility).toEqual([0, 0, 0])
    expect(result.current.isDone).toBe(false)
  })
})
