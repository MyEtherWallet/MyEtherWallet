import { ref, watch, type Ref } from 'vue'
import configs from '@/configs'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'

/**
 * The URL of a wallet's logo. Static configs carry it as a string; RainbowKit
 * wallets carry a function that lazily imports it.
 *
 * Follows the getter (not just its first value) so a reused card or tile
 * never keeps another wallet's logo.
 */
export const useWalletIconUrl = (
  wallet: () => WalletConfig,
): Ref<string | undefined> => {
  const iconUrl = ref<string | undefined>()
  watch(
    () => wallet().icon,
    async icon => {
      iconUrl.value = typeof icon === 'string' ? icon : undefined
      if (typeof icon !== 'function') return
      try {
        const url = await icon()
        if (wallet().icon === icon) iconUrl.value = url
      } catch (error) {
        // The logo is a lazily imported chunk; failing to load it (network blip, stale
        // chunk after a redeploy, content blockers) is expected and non-actionable.
        // AppAvatar falls back to initials, so don't report it as noise.
        if (configs.BUILD_MODE !== 'production') {
          console.error('Error loading wallet image:', wallet().name, error)
        }
      }
    },
    { immediate: true },
  )
  return iconUrl
}
