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
import type { Wallet } from '@rainbow-me/rainbowkit'
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
    rkDetails?: Wallet
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
    const injectedWallets: WalletConfig[] = []
    rkConnectors.forEach(async wallet => {
      const rainbowId = wallet.rkDetails?.id
      //RainBow Kit Wallets that do not include defualts and ledger
      if (
        wallet.rkDetails !== undefined &&
        rainbowId &&
        !DEFAULT_IDS.includes(rainbowId) &&
        rainbowId !== 'ledger'
      ) {
        const _types: WalletConfigType[] = []
        if (wallet.rkDetails.extension) {
          _types.push(WalletConfigType.EXTENSION)
        }
        if (wallet.rkDetails.mobile) {
          _types.push(WalletConfigType.MOBILE)
        }
        if (wallet.rkDetails.desktop) {
          _types.push(WalletConfigType.DESKTOP)
        }

        newConArr.push({
          ...wallet,
          id: wallet.id,
          name: walletGetName(wallet),
          icon: walletGetIcon(wallet),
          type: _types,
        })
      }
      // Ledger Mobile
      else if (wallet.rkDetails && wallet.rkDetails.id === 'ledger') {
        newConArr.push({
          ...wallet,
          id: 'ledger-mobile',
          name: 'Ledger Mobile',
          icon: walletGetIcon(wallet),
          type: [WalletConfigType.MOBILE],
        })
      }
      //Mock Wallet for testing
      else if (wallet.id === 'mock') {
        newConArr.push({
          ...wallet,
          id: wallet.id,
          icon: walletGetIcon(wallet),
          type: [WalletConfigType.MOCK],
        })
      }
      //Injected Wallets
      else if (wallet.rkDetails === undefined) {
        injectedWallets.push({
          ...wallet,
          id: wallet.id,
          name: walletGetName(wallet),
          icon: walletGetIcon(wallet),
          type: [WalletConfigType.EXTENSION],
        })
      }
    })

    //Need to do this since injected ids do not match rainbow kit ids and we want to avoid duplicates
    if (injectedWallets.length > 0) {
      //check if injected wallet is already in newConArr by name, if not add it
      injectedWallets.forEach(injectedWallet => {
        const existingWalletIndex = newConArr.findIndex(
          wallet =>
            wallet.name.toLowerCase() === injectedWallet.name.toLowerCase(),
        )
        if (
          existingWalletIndex < 0 &&
          !DEFAULT_IDS.includes(injectedWallet.name.toLowerCase())
        ) {
          // If no wallet with same name, add injected wallet to array
          newConArr.push(injectedWallet)
        }
      })
    }

    // Remove duplicates by wallet.name from injected, prioritizing wallet with more types
    // Sort by type length descending first to ensure wallets with more types are prioritized
    const sortedByTypes = [...newConArr].sort(
      (a, b) => (b.type?.length || 0) - (a.type?.length || 0),
    )
    const walletsByName = new Map<string, WalletConfig>()
    sortedByTypes.forEach(wallet => {
      // Only add if not already in map (first occurrence wins, which has most types due to sorting)
      if (!walletsByName.has(wallet.name)) {
        walletsByName.set(wallet.name, wallet)
      }
    })
    const uniqueWallets = Array.from(walletsByName.values())

    return uniqueWallets.filter(wallet => {
      return (
        selectedChain.value?.type === 'EVM' ||
        (wallet.canSupport && !!wallet.canSupport(selectedChain.value))
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
        // Merge wcWallet first so the static walletConfigs UI metadata
        // (icon, name, type) wins. The wagmi connector can expose `icon`
        // as undefined or a non-function value, which used to overwrite
        // the static MewLogo and crash BtnWallet's resolveImg.
        defaultWallets.push(Object.assign({}, wcWallet, wallet))
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
