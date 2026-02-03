import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import {
  type WalletConfig,
  WalletConfigType,
  walletConfigs,
  type defaultWalletId,
} from '@/modules/access/common/walletConfigs'
import { generateConfig } from '@/providers/ethereum/wagmiConfig'
import { useChainsStore } from '@/stores/chainsStore'
import type { Connector, CreateConnectorFn } from '@wagmi/core'
import { useAccessStore } from '@/stores/accessStore'

export const useWalletList = () => {
  const DEFAULT_IDS = ['enkrypt', 'mew']
  const chainStore = useChainsStore()
  const { selectedChain: selectedChainFromChainsStore, chains } =
    storeToRefs(chainStore)
  const accessStore = useAccessStore()
  const { selectedChain: selectedChainFromAccessStore } =
    storeToRefs(accessStore)

  const selectedChain = computed(() => {
    return (
      selectedChainFromAccessStore.value || selectedChainFromChainsStore.value
    )
  })

  const wagmiConfig = generateConfig(chains.value)
  const { connectors } = wagmiConfig
  interface RkConnector extends Connector<CreateConnectorFn> {
    rkDetails: {
      iconUrl: () => Promise<string>
      name: string
      isRainbowKitConnector: boolean
    }
  }
  const walletGetIcon = (wallet: RkConnector) => {
    if (wallet.icon) return wallet.icon
    if (wallet.rkDetails && wallet.rkDetails.iconUrl)
      return wallet.rkDetails.iconUrl
    return ''
  }

  const walletGetName = (wallet: RkConnector) => {
    if (wallet.rkDetails && wallet.rkDetails.name) return wallet.rkDetails.name
    return wallet.name
  }
  /** -------------------
   * Wallets
   * -------------------*/
  const newWalletList = computed<WalletConfig[]>(() => {
    if (selectedChain.value && selectedChain.value.type !== 'EVM') return []
    const newConArr: WalletConfig[] = []
    const rkConnectors = connectors as RkConnector[]
    rkConnectors.forEach(async wallet => {
      if (
        !DEFAULT_IDS.includes(wallet.id) &&
        wallet.id !== 'ledger' &&
        wallet.id !== 'mock'
      ) {
        const _types: WalletConfigType[] = []
        if (wallet.extension || wallet.installed) {
          _types.push(WalletConfigType.EXTENSION)
        }
        if (wallet.rkDetails && wallet.rkDetails.isRainbowKitConnector) {
          _types.push(WalletConfigType.MOBILE)
        }
        if (wallet.desktop) {
          _types.push(WalletConfigType.DESKTOP)
        }

        newConArr.push({
          ...wallet,
          id: wallet.id,
          name: walletGetName(wallet),
          icon: walletGetIcon(wallet),
          type: _types,
        })
      } else if (wallet.id === 'ledger') {
        newConArr.push({
          ...wallet,
          id: 'ledger-mobile',
          name: 'Ledger Mobile',
          icon: walletGetIcon(wallet),
          type: [WalletConfigType.MOBILE],
        })
      } else if (wallet.id === 'mock') {
        newConArr.push({
          ...wallet,
          id: wallet.id,
          icon: walletGetIcon(wallet),
          type: [WalletConfigType.MOCK],
        })
      }
    })
    return newConArr.filter(wallet => {
      return (
        wallet.canSupport &&
        !!wallet.canSupport(
          selectedChain.value || selectedChainFromChainsStore.value,
        )
      )
    })
  })

  const defaultWallets = computed<WalletConfig[]>(() => {
    const defaultWallets: WalletConfig[] = []
    const keys = Object.keys(walletConfigs) as Array<defaultWalletId>
    keys.forEach(key => {
      const wallet = walletConfigs[key]
      if (wallet.isWC) {
        const wcWallet = connectors.find(w => w.id === wallet.id)
        defaultWallets.push(Object.assign({}, wallet, wcWallet))
      } else {
        defaultWallets.push(wallet)
      }
    })

    return defaultWallets.filter(wallet => {
      return wallet.canSupport && !!wallet.canSupport(selectedChain.value)
    })
  })

  return {
    defaultWallets,
    newWalletList,
  }
}
