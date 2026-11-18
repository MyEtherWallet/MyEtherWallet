import { afterEach, describe, expect, it } from 'vitest'
import { passkeySupported } from '@/providers/privy/passkeySupport'

describe('passkeySupported', () => {
  const globals = window as { PublicKeyCredential?: unknown }
  const original = globals.PublicKeyCredential

  afterEach(() => {
    globals.PublicKeyCredential = original
  })

  it('holds in a browser that has the passkey API', () => {
    globals.PublicKeyCredential = function PublicKeyCredential() {}

    expect(passkeySupported()).toBe(true)
  })

  it('does not hold in a browser without it', () => {
    globals.PublicKeyCredential = undefined

    expect(passkeySupported()).toBe(false)
  })
})
