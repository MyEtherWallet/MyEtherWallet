import type { WalletView } from '@/modules/access/common/walletConfigs'

/** Back-button target per view; anything not listed goes back to the chooser. */
const PARENT_VIEW: Partial<Record<WalletView, WalletView>> = {
  download_mobile: 'sign_up',
}

export const parentView = (view: WalletView): WalletView =>
  PARENT_VIEW[view] ?? 'default'
