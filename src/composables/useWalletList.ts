import { storeToRefs } from 'pinia';
import { computed } from 'vue'
import { type WalletConfig, WalletConfigType, walletConfigs, type defaultWalletId } from '@/modules/access/common/walletConfigs'
import * as rainbowkitWallets from '@rainbow-me/rainbowkit/wallets'
import Configs from '@/configs'
import { useChainsStore } from '@/stores/chainsStore'

export const useWalletList = () => {
  const DEFAULT_IDS = ['enkrypt', 'mew']
  const projectId = Configs.WALLET_CONNECT_PROJECT_ID
  const chainStore = useChainsStore()
  const { selectedChain } = storeToRefs(chainStore)

  /** -------------------
 * Wallets
 * -------------------*/
  const allRainbowWallets = Object.values(rainbowkitWallets)

  const initializedWallets = allRainbowWallets.map(wallet =>
    wallet({ projectId, appName: 'MEW' }),
  )

  const newWalletList = computed<WalletConfig[]>(() => {
    if (selectedChain.value && selectedChain.value.type !== 'EVM') return []
    const newConArr: WalletConfig[] = []
    initializedWallets.forEach(wallet => {
      if (!DEFAULT_IDS.includes(wallet.id) && wallet.id !== 'ledger') {
        const _types: WalletConfigType[] = []
        if (
          wallet.extension ||
          (wallet.hasOwnProperty('installed') && !wallet.extension)
        ) {
          _types.push(WalletConfigType.EXTENSION)
        }
        if (wallet.mobile || wallet.qrCode) {
          _types.push(WalletConfigType.MOBILE)
        }
        if (wallet.desktop) {
          _types.push(WalletConfigType.DESKTOP)
        }

        newConArr.push({
          ...wallet,
          id: wallet.id,
          name: wallet.name,
          icon: wallet.iconUrl,
          type: _types,
        })
      } else if (wallet.id === 'ledger') {
        newConArr.push({
          ...wallet,
          id: 'ledger-mobile',
          name: 'Ledger Mobile',
          icon: wallet.iconUrl,
          type: [WalletConfigType.MOBILE],
        })
      }
    })
    return newConArr
  })

  const defaultWallets = computed<WalletConfig[]>(() => {
    const defaultWallets: WalletConfig[] = []
    const keys = Object.keys(walletConfigs) as Array<defaultWalletId>
    keys.forEach(key => {
      const wallet = walletConfigs[key]
      if (wallet.isWC) {
        const wcWallet = initializedWallets.find(w => w.id === wallet.id)
        defaultWallets.push(Object.assign({}, wallet, wcWallet))
      } else {
        defaultWallets.push(wallet)
      }
    })

    return defaultWallets
  })

  return {
    defaultWallets,
    newWalletList,
  }
}