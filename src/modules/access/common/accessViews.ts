import type { WalletView } from '@/modules/access/common/walletConfigs'

/** Back-button target: download → sign-up, everything else → the chooser. */
export const parentView = (view: WalletView): WalletView =>
  view === 'download_mobile' ? 'sign_up' : 'default'
