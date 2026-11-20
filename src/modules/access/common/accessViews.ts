import type { WalletView } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types'

/**
 * The screen the connect dialog always opens on: Log in / Sign Up (design,
 * 2026-11-19). Every wallet is reached from it, so it has no Back of its own.
 */
export const FIRST_ACCESS_VIEW = 'sign_up' satisfies WalletView

/**
 * The two screens other steps are opened from: Log in / Sign Up (its wallet
 * row) and the wallet chooser.
 */
export type AccessHubView = typeof FIRST_ACCESS_VIEW | 'default'
export const isAccessHubView = (view: WalletView): view is AccessHubView =>
  view === FIRST_ACCESS_VIEW || view === 'default'

/** Wallets that hold several addresses, and the step where one is picked. */
const ADDRESS_STEPS: Partial<Record<WalletType, WalletView>> = {
  [WalletType.LEDGER]: 'ledger',
  [WalletType.TREZOR]: 'trezor',
  [WalletType.MNEMONIC]: 'mnemonic',
}
/**
 * The step where a connected wallet of this type picks another of its
 * addresses, or null when the wallet has only the one.
 */
export const addressStepFor = (
  type: WalletType | undefined,
): WalletView | null => (type && ADDRESS_STEPS[type]) ?? null
