import { renderHook, act } from '@testing-library/react'
import { useTypingText } from '../app/[locale]/Hooks/useTypingText'

afterEach(() => {
  vi.useRealTimers()
})

describe('useTypingText', () => {
  test('returns empty string when disabled', () => {
    const { result } = renderHook(() => useTypingText('hello', 70, false))
    expect(result.current).toBe('')
  })

  test('starts empty and types one character per interval', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTypingText('hi', 50, true))

    expect(result.current).toBe('')

    await act(async () => { vi.advanceTimersByTime(50) })
    expect(result.current).toBe('h')

    await act(async () => { vi.advanceTimersByTime(50) })
    expect(result.current).toBe('hi')
  })

  test('types out the full text after enough time', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTypingText('abc', 30, true))

    // 3 chars × 30ms + 1 extra tick so clearInterval fires
    await act(async () => { vi.advanceTimersByTime(30 * 4) })
    expect(result.current).toBe('abc')
  })

  test('resets to empty when text prop changes', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ text }: { text: string }) => useTypingText(text, 50, true),
      { initialProps: { text: 'ab' } }
    )
    await act(async () => { vi.advanceTimersByTime(50 * 3) })
    expect(result.current).toBe('ab')

    await act(async () => { rerender({ text: 'xyz' }) })
    expect(result.current).toBe('')
  })
})
