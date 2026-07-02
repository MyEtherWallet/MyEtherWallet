import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import {
  promoteNext,
  type SavedAccount,
  type PersistedEntry,
} from '@/stores/saved_accounts/savedAccountsLogic'
import type { Chain, ChainType } from '@/mew_api/types'
import type { WalletType } from '@/providers/types'

export function useAccountSwitch() {
  const walletStore = useWalletStore()
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const watchOnlyStore = useWatchOnlyStore()
  const toastStore = useToastStore()

  const chainForType = (chainType: string): Chain | undefined =>
    chainsStore.chains.find((c: Chain) => c.type === chainType)

  const followNetworkIfNeeded = (account: SavedAccount): void => {
    if (chainsStore.selectedChain?.type === account.chainType) return
    const target = chainForType(account.chainType)
    if (!target) return
    globalStore.setSelectedNetwork(target.name)
    toastStore.addToastMessage({
      text: 'Network switched',
      textSecondary: `Switched to ${target.nameLong ?? target.name} to view this address`,
      type: ToastType.Info,
    })
  }

  const activateReadOnly = async (
    address: string,
    chain: Chain,
    walletType: WalletType,
    chainType: ChainType,
    walletName: string,
    configType: SavedAccount['walletConfigType'],
  ): Promise<void> => {
    const wallet = new WatchOnlyWallet(address, chain, walletType, chainType, walletName)
    await walletStore.setWallet(wallet, walletName, configType)
  }

  const switchTo = async (account: SavedAccount): Promise<void> => {
    if (account.id === watchOnlyStore.activeId) return
    followNetworkIfNeeded(account)
    const chain = chainsStore.selectedChain as Chain | undefined
    if (!chain) return

    // Selecting a row only VIEWS the address (read-only) and updates the active card —
    // it never launches the connect/unlock flow. Only the card's "Connect address"
    // button triggers connecting (handled separately via useAddAccount).
    await activateReadOnly(
      account.address, chain, account.providerType,
      account.chainType, account.walletName, account.walletConfigType,
    )
  }

  const deleteAccount = async (account: SavedAccount): Promise<void> => {
    const wasActive = account.id === watchOnlyStore.activeId
    watchOnlyStore.removeWallet(account.address, { type: account.chainType } as Chain)
    if (!wasActive) return
    const next: PersistedEntry | null = promoteNext(
      watchOnlyStore.watchOnlyAddresses,
      account.chainType,
      account.address,
    )
    if (next) {
      await activateReadOnly(
        next.address, next.chain, next.walletType as WalletType,
        next.type, next.walletName, account.walletConfigType,
      )
    } else {
      walletStore.disconnectWallet()
    }
  }

  return { switchTo, deleteAccount }
}
