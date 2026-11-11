import { lockPageScroll } from '../app/[locale]/utils/scroll'

describe('lockPageScroll', () => {
  test('blocks page scroll until the returned function is called', () => {
    const unlock = lockPageScroll()
    expect(document.documentElement.style.overflow).toBe('hidden')

    unlock()
    expect(document.documentElement.style.overflow).toBe('')
  })
})
