import { describe, expect, it } from 'vitest'
import {
  fundActionsOffered,
  passkeysOffered,
} from '@/providers/privy/accountOffer'

// Design's call of 2026-11-19. Whoever turns one on changes it here, in the
// open, and not by accident.
describe('what the Privy account offers', () => {
  it('does not offer adding a passkey', () => {
    expect(passkeysOffered()).toBe(false)
  })

  it('does not offer the fund cards in the account menu', () => {
    expect(fundActionsOffered()).toBe(false)
  })
})
