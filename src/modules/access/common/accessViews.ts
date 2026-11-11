import type { WalletView } from '@/modules/access/common/walletConfigs'
import configs from '@/configs'

/**
 * Back-button target: download → sign-up (the chooser while social login is
 * off, since the download cards then sit there), everything else → the chooser.
 */
export const parentView = (view: WalletView): WalletView =>
  view === 'download_mobile' && configs.SHOW_SOCIAL_LOGIN
    ? 'sign_up'
    : 'default'
