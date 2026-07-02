import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import {
  walletConfigs,
  WalletConfigType,
  type WalletConfig,
} from '@/modules/access/common/walletConfigs'
import type { Chain, ChainType } from '@/mew_api/types'
import {
  buildId,
  canAdd,
  upsertEntry,
  removeEntry,
  isNameUnique,
  backfillNames,
  toSavedAccount,
  type RecentAddress,
  type PersistedEntry,
  type SavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'
import { truncateAddress } from '@/utils/filters'

export const useWatchOnlyStore = defineStore('useWatchOnlyStore', () => {
  const watchOnlyAddresses = useLocalStorage<RecentAddress>(
    'watchOnlyList',
    { EVM: [], BITCOIN: [] },
    { mergeDefaults: true },
  )

  const walletStore = useWalletStore()
  const chainsStore = useChainsStore()

  const configFor = (walletName: string) =>
    Object.values(walletConfigs).find(
      (c: WalletConfig) => c.name === walletName,
    ) as WalletConfig | undefined

  const view = (
    entry: PersistedEntry,
    kindOverride?: SavedAccount['kind'],
  ): SavedAccount =>
    toSavedAccount(entry, {
      config: configFor(entry.walletName),
      kindOverride,
      fallbackConfigType: WalletConfigType.SOFTWARE,
    })

  const activeId = computed<string | null>(() => {
    const address = walletStore.walletAddress
    const chainType = chainsStore.selectedChain?.type as ChainType | undefined
    if (!address || !chainType) return null
    return buildId(chainType, address)
  })

  const allAccounts = computed<SavedAccount[]>(() =>
    Object.values(watchOnlyAddresses.value)
      .flat()
      .map(e => {
        const isActive = buildId(e.type, e.address) === activeId.value
        // Only the active account can be "connected" (signing). Every other saved
        // address is view-only, so a previously-connected address never keeps a
        // connected indicator after switching — at most one address is connected.
        return view(
          e,
          isActive && !walletStore.isWatchOnly ? 'signing' : 'watchOnly',
        )
      }),
  )

  const activeAccount = computed<SavedAccount | null>(
    () => allAccounts.value.find(a => a.id === activeId.value) ?? null,
  )

  const savedAccounts = computed<SavedAccount[]>(() =>
    allAccounts.value.filter(a => a.id !== activeId.value),
  )

  const isAtCap = computed<boolean>(
    () => Object.values(watchOnlyAddresses.value).flat().length >= 20,
  )

  const makeEntry = (
    address: string,
    chain: Chain,
    walletType: string,
    type: ChainType,
    walletName: string,
  ): PersistedEntry => ({
    address,
    walletName,
    chain,
    type,
    walletType,
    // Default the label to the truncated address (not "Address N") so it's
    // recognizable and unique per address.
    addressName: truncateAddress(address, 6, 4),
  })

  /** Auto-capture path (called by walletStore.setAddress on every connect). Void; silently caps. */
  const addWallet = (
    address: string,
    chain: Chain,
    walletType: string,
    type: ChainType,
    walletName: string,
  ): void => {
    // Guard against a chain-type switch race storing an address in the wrong
    // bucket (e.g. an EVM address landing under BITCOIN, creating a phantom
    // duplicate). EVM addresses are 0x-prefixed; Bitcoin addresses are not.
    const looksEvm = address.toLowerCase().startsWith('0x')
    if ((type === 'BITCOIN') === looksEvm) return
    const bucket = watchOnlyAddresses.value[type] ?? []
    const prior = bucket.find(
      e => e.address.toLowerCase() === address.toLowerCase(),
    )
    if (!prior && !canAdd(watchOnlyAddresses.value, type, address)) return
    // Upsert IN PLACE (never reorder) so selecting/viewing an address keeps the popup
    // list order stable. New entries append at the end; existing keep their position.
    const entry: PersistedEntry = prior
      ? { ...prior, walletName, walletType, chain } // preserve addressName + position
      : makeEntry(address, chain, walletType, type, walletName)
    watchOnlyAddresses.value = upsertEntry(watchOnlyAddresses.value, entry)
  }

  /** Explicit add (add-flow / save-detected). Reports the reason on failure. */
  const tryAddAddress = (
    address: string,
    chain: Chain,
    walletType: string,
    type: ChainType,
    walletName: string,
  ): { added: boolean; reason?: 'cap' | 'duplicate' } => {
    const exists = (watchOnlyAddresses.value[type] ?? []).some(
      e => e.address.toLowerCase() === address.toLowerCase(),
    )
    if (exists) return { added: false, reason: 'duplicate' }
    if (!canAdd(watchOnlyAddresses.value, type, address))
      return { added: false, reason: 'cap' }
    addWallet(address, chain, walletType, type, walletName)
    return { added: true }
  }

  const removeWallet = (address: string, chain: Chain): void => {
    watchOnlyAddresses.value = removeEntry(
      watchOnlyAddresses.value,
      chain.type as ChainType,
      address,
    )
  }

  const renameAccount = (
    key: string,
    name: string,
  ): { ok: boolean; reason?: 'duplicate' } => {
    if (!isNameUnique(watchOnlyAddresses.value, name, key))
      return { ok: false, reason: 'duplicate' }
    const next: RecentAddress = { ...watchOnlyAddresses.value }
    for (const type of Object.keys(next)) {
      next[type] = next[type].map(e =>
        buildId(e.type, e.address) === key ? { ...e, addressName: name } : e,
      )
    }
    watchOnlyAddresses.value = next
    return { ok: true }
  }

  /** One-shot: assign default names to legacy entries missing them. */
  const backfill = (): void => {
    watchOnlyAddresses.value = backfillNames(watchOnlyAddresses.value)
  }

  return {
    watchOnlyAddresses,
    addWallet,
    tryAddAddress,
    removeWallet,
    renameAccount,
    backfill,
    activeId,
    activeAccount,
    savedAccounts,
    allAccounts,
    isAtCap,
  }
})
