// src/composables/useAddAccount.ts
import { useAccessStore } from '@/stores/accessStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import {
  SAVED_ACCOUNTS_CAP,
  type SavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'
import {
  walletConfigs,
  type defaultWalletId,
} from '@/modules/access/common/walletConfigs'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { useWalletList } from '@/composables/useWalletList'

export function useAddAccount() {
  const accessStore = useAccessStore()
  const watchOnlyStore = useWatchOnlyStore()
  const toastStore = useToastStore()
  const { connect } = useConnectWallet()
  const { newWalletList } = useWalletList()

  /**
   * Adding is just opening the existing connect flow: on success the wallet's
   * setAddress() persists the new address into watchOnlyStore (capped, named).
   * We only guard the cap up-front.
   */
  const startAdd = (): void => {
    if (watchOnlyStore.isAtCap) {
      toastStore.addToastMessage({
        text: 'Address limit reached',
        textSecondary: `You can save up to ${SAVED_ACCOUNTS_CAP} addresses.`,
        type: ToastType.Error,
      })
      return
    }
    // Adding a new address: a duplicate active address should warn ("already saved").
    accessStore.setExpectNewAddress(true)
    accessStore.setIntendedAddress(null)
    accessStore.openAccessDialog()
  }

  /**
   * Connecting an already-saved (watch-only) address: we know which wallet it
   * belongs to, so jump straight to that wallet's connect flow and skip the
   * wallet chooser. Falls back to the chooser when the wallet can't be resolved
   * to a static config (e.g. MetaMask and other dynamic injected connectors).
   */
  const connectSaved = async (account: SavedAccount): Promise<void> => {
    // 1) Static config (Enkrypt, Unisat, Ledger, Trezor, keystore, mnemonic,
    //    privateKey, MEW) resolved from the saved connectorId.
    // 2) Otherwise a dynamic injected wallet (MetaMask, Rabby, …) matched by
    //    name against the detected EIP-6963 providers — same list the chooser
    //    renders, so connect() drives the identical flow.
    // 3) If neither resolves (wallet not installed/detected) fall back to the
    //    chooser, which openAccessDialog shows.
    const config =
      (account.connectorId
        ? walletConfigs[account.connectorId as defaultWalletId]
        : undefined) ??
      newWalletList.value.find(w => w.name === account.walletName)
    // Connecting a specific saved address (upgrade), not adding a new one — so a
    // matching active address connects; a mismatch prompts the user to select it.
    accessStore.setExpectNewAddress(false)
    accessStore.setIntendedAddress(account.address)
    // We already know which wallet this address belongs to, so connect straight
    // to it without surfacing the access chooser dialog. Connecting feedback
    // lives on the card's button; on a mismatch the connect-address prompt
    // slides into the address popup. Only fall back to the chooser when the
    // wallet can't be resolved to a config.
    if (config) {
      await connect(config)
    } else {
      accessStore.openAccessDialog()
    }
  }

  return { startAdd, connectSaved }
}
