import { describe, expect, it } from 'vitest'
import { isFramed } from '../../../export_wallet/framing'

describe('isFramed', () => {
  it('is false for a page that is its own top window', () => {
    const page = {} as Window
    expect(isFramed({ top: page, self: page })).toBe(false)
  })

  it('is true for a page shown inside another site’s frame', () => {
    expect(isFramed({ top: {} as Window, self: {} as Window })).toBe(true)
  })

  it('is true when the top window cannot even be read', () => {
    const page = {
      self: {} as Window,
      get top(): Window {
        throw new DOMException('Blocked', 'SecurityError')
      },
    }
    expect(isFramed(page)).toBe(true)
  })
})
