// src/composables/useAccountSwitch.ts
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'
import { useSavedAccountsStore } from '@/stores/savedAccountsStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import type { defaultWalletId } from '@/modules/access/common/walletConfigs'
import {
  promoteNext,
  type SavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'
import type { Chain } from '@/mew_api/types'

export function useAccountSwitch() {
  const walletStore = useWalletStore()
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  const accessStore = useAccessStore()
  const savedAccountsStore = useSavedAccountsStore()
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

  const switchTo = async (account: SavedAccount): Promise<void> => {
    if (account.id === savedAccountsStore.activeId) return

    followNetworkIfNeeded(account)
    const chain = chainsStore.selectedChain as Chain | undefined
    if (!chain) return

    if (account.kind === 'watchOnly') {
      const wallet = new WatchOnlyWallet(
        account.address,
        chain,
        account.providerType,
        account.chainType,
        account.walletName,
      )
      await walletStore.setWallet(wallet, account.walletName, account.walletConfigType)
      return
    }

    // signing → auto-trigger unlock via the existing connect flow
    accessStore.setSelectedChain(chain)
    const view =
      walletConfigs[account.connectorId as defaultWalletId]?.walletViewType ?? 'default'
    accessStore.openAccessDialog()
    accessStore.setCurrentView(view)
  }

  const deleteAccount = async (account: SavedAccount): Promise<void> => {
    const wasActive = account.id === savedAccountsStore.activeId
    savedAccountsStore.removeAccount(account.id)
    if (!wasActive) return
    const next = promoteNext(savedAccountsStore.accounts as SavedAccount[])
    if (next) {
      await switchTo(next)
    } else {
      walletStore.disconnectWallet()
    }
  }

  return { switchTo, deleteAccount }
}
