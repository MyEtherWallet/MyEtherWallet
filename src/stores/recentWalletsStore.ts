import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'

export const useRecentWalletsStore = defineStore(
  'useRecentWalletsStore',
  () => {
    const recentWallets = useLocalStorage<WalletConfig[]>('recentWallets', [], {
      mergeDefaults: true,
    })
    const addWallet = (passedWallet: WalletConfig) => {
      const passedWalletExists =
        recentWallets.value.find(wallet => wallet.id === passedWallet.id) !==
        undefined
      const isOfficial = passedWallet.isOfficial

      if (passedWalletExists || isOfficial) {
        return
      }
      if (recentWallets.value.length < 2) {
        recentWallets.value.push(passedWallet)
      } else {
        recentWallets.value.splice(0, 1) // remove the first element
        recentWallets.value.push(passedWallet)
      }
    }

    return { addWallet, recentWallets }
  },
)
