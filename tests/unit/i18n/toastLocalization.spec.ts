import { describe, it, expect } from 'vitest'
import messages from '@/i18n/locales'

/**
 * MEW-2036 — every toast message must be localized.
 *
 * These are the i18n keys referenced by `toastStore.addToastMessage(...)`
 * call-sites across the app. This guards against a call-site referencing a
 * key that is missing from any active locale (which would silently fall back
 * to English / render the raw key). `vue-tsc` cannot catch this because
 * `t()` accepts any string, so this test is the only automated guard.
 */
const TOAST_KEYS = [
  // Wallet connect flow (useConnectWallet.ts)
  'access_wallet.toast.wallet_connected',
  'access_wallet.toast.wallet_connected_description',
  'access_wallet.toast.wallet_not_detected',
  'access_wallet.toast.web3_wallet_not_detected',
  'access_wallet.toast.install_extension',
  'access_wallet.toast.install_extension_or_select',
  'access_wallet.toast.click_here_to_install',
  'access_wallet.toast.could_not_connect',
  'access_wallet.toast.connection_timed_out',
  'access_wallet.toast.connect_request_pending',
  'access_wallet.toast.network_not_supported',
  'common.dont_have_wallet',
  // Derivation paths (derivationStore.ts)
  'derivation_path.label_exists',
  'derivation_path.added_successfully',
  'derivation_path.invalid_path',
  // Network change (walletStore.ts)
  'common.network_change_failed',
  'common.network_change_failed_description',
  // Global network switch toast — MEW-1980 (walletStore.ts)
  'common.network_switched',
  // Email subscription (useEmailSubscription.ts)
  'common.subscribe.success',
  'common.subscribe.error',
  // Generic error (useSwap.ts, ModuleAccessHardwareWallet.vue, useEmailSubscription.ts)
  'common.something_went_wrong',
  // Hardware-wallet (Ledger) errors — MEW-2049
  'common.error.ledger_locked',
  'common.error.ledger_app_not_open',
  // Balances processing (App.vue)
  'common.processing_tokens_title',
  'common.processing_tokens_description',
  // Rewards network switch (RewardsPortfolio.vue)
  'rewards.switched_to_ethereum',
  // Trade token switch toast — MEW-1981 (ModuleTrade.vue)
  'trade.toast.tokens-switched',
]

const LOCALES = ['en', 'es', 'zh'] as const

const resolve = (obj: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    )

describe('MEW-2036 toast localization keys', () => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      for (const key of TOAST_KEYS) {
        it(`has a non-empty string for "${key}"`, () => {
          const value = resolve(
            (messages as Record<string, unknown>)[locale],
            key,
          )
          expect(typeof value, `${locale} → ${key}`).toBe('string')
          expect((value as string).trim().length).toBeGreaterThan(0)
        })
      }
    })
  }
})
