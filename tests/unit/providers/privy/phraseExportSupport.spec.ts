import { describe, expect, it } from 'vitest'
import { phraseExportSupported } from '@/providers/privy/phraseExportSupport'

describe('phraseExportSupported', () => {
  // Privy, 2026-11-18: client-side export exists only in their React SDK, and
  // the user signer signs no export request. Whoever changes this answer must
  // bring an export path Privy supports with it.
  it('says the page cannot get a recovery phrase from Privy', () => {
    expect(phraseExportSupported()).toBe(false)
  })
})
