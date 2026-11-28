import { describe, expect, it, vi } from 'vitest'

vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))
// The analytics class imports the wallet configs, which reach the
// hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { Analytics } from '@/analytics/amplitude'
import { AccountSecurityEvent, OnboardingEvent } from '@/analytics/events'

describe('onboarding analytics', () => {
  it('sends an onboarding event with its payload to Amplitude', async () => {
    const track = vi.fn(() => ({ promise: Promise.resolve() }))
    const analytics = new Analytics({ amplitude: { track } as never })

    await analytics.trackOnboardingEvent(OnboardingEvent.OPT_IN, {
      value: true,
    })

    expect(track).toHaveBeenCalledWith('Onboarding_Opt_In', { value: true })
  })

  it('sends an onboarding event that has no payload', async () => {
    const track = vi.fn(() => ({ promise: Promise.resolve() }))
    const analytics = new Analytics({ amplitude: { track } as never })

    await analytics.trackOnboardingEvent(OnboardingEvent.ENTRY_VIEWED)

    expect(track).toHaveBeenCalledWith('Onboarding_Entry_Viewed', {})
  })
})

describe('account security analytics', () => {
  it('sends a passkey event with where it happened', async () => {
    const track = vi.fn(() => ({ promise: Promise.resolve() }))
    const analytics = new Analytics({ amplitude: { track } as never })

    await analytics.trackAccountSecurityEvent(
      AccountSecurityEvent.PASSKEY_ADD_FAILED,
      { source: 'home_prompt', reason: 'unknown' },
    )

    expect(track).toHaveBeenCalledWith('Passkey_Add_Failed', {
      source: 'home_prompt',
      reason: 'unknown',
    })
  })

  it('sends a recovery phrase event that has no payload', async () => {
    const track = vi.fn(() => ({ promise: Promise.resolve() }))
    const analytics = new Analytics({ amplitude: { track } as never })

    await analytics.trackAccountSecurityEvent(
      AccountSecurityEvent.RECOVERY_PHRASE_OPENED,
    )

    expect(track).toHaveBeenCalledWith('Recovery_Phrase_Opened', {})
  })
})
