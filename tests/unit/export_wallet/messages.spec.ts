import { beforeEach, describe, expect, it } from 'vitest'
import { exportPageMessages } from '../../../export_wallet/messages'

describe('exportPageMessages', () => {
  beforeEach(() => localStorage.clear())

  it('speaks English to a visitor with no saved language', () => {
    expect(exportPageMessages().log_in).toBe('Log in')
  })

  it("speaks the language saved by the app's own setting", () => {
    localStorage.setItem('mew-locale', 'es')

    expect(exportPageMessages().log_in).toBe('Iniciar sesión')
  })

  it('falls back to English for a language it has no words for', () => {
    localStorage.setItem('mew-locale', 'xx')

    expect(exportPageMessages().log_in).toBe('Log in')
  })

  it('falls back to English for a saved value that only looks like a language', () => {
    localStorage.setItem('mew-locale', 'constructor')

    expect(exportPageMessages().log_in).toBe('Log in')
  })
})
