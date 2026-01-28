import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import {
  WalletConfigType,
  type WalletConfig,
  type WalletView,
} from '@/modules/access/common/walletConfigs'

interface SavedWalletType {
  id: string
  name: string
  icon: string
  type: WalletConfigType[]
  walletViewType?: WalletView
}

export const useRecentWalletsStore = defineStore(
  'useRecentWalletsStore',
  () => {
    const recentWallets = useLocalStorage<SavedWalletType[]>(
      'recentWallets',
      [],
      {
        mergeDefaults: true,
      },
    )
    const addWallet = (passedWallet: WalletConfig) => {
      const passedWalletExists =
        recentWallets.value.find(wallet => wallet.id === passedWallet.id) !==
        undefined
      const isOfficial = passedWallet.isOfficial

      if (passedWalletExists || isOfficial) {
        return
      }
      const walletToSave: SavedWalletType = {
        id: passedWallet.id,
        name: passedWallet.name,
        icon: passedWallet.icon as string,
        type: passedWallet.type,
        walletViewType: passedWallet.walletViewType,
      }
      if (recentWallets.value.length < 2) {
        recentWallets.value.push(walletToSave)
      } else {
        recentWallets.value.splice(0, 1) // remove the first element
        recentWallets.value.push(walletToSave)
      }
    }

    return { addWallet, recentWallets }
  },
)
