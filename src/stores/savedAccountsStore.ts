// src/stores/savedAccountsStore.ts
import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { walletConfigs, WalletConfigType } from '@/modules/access/common/walletConfigs'
import type { ChainType } from '@/mew_api/types'
import type { WalletType } from '@/providers/types'
import {
  buildId,
  canAdd,
  isAtCap as isAtCapFn,
  upsertEntry,
  removeEntry,
  backfillNames,
  flatten,
  type SavedAccount,
  type RecentAddress,
  type PersistedEntry,
  toSavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'

export const useSavedAccountsStore = defineStore('savedAccountsStore', () => {
  const addresses = useLocalStorage<RecentAddress>('savedAccounts', { EVM: [], BITCOIN: [] })

  const walletStore = useWalletStore()
  const chainsStore = useChainsStore()

  const activeId = computed<string | null>(() => {
    const address = walletStore.walletAddress
    const chainType = chainsStore.selectedChain?.type as ChainType | undefined
    if (!address || !chainType) return null
    return buildId(chainType, address)
  })

  const allAccounts = computed<SavedAccount[]>(() =>
    flatten(addresses.value).map(e =>
      toSavedAccount(e, {
        fallbackConfigType: WalletConfigType.SOFTWARE,
      }),
    ),
  )

  const activeAccount = computed<SavedAccount | null>(() => {
    if (!activeId.value) return null
    return allAccounts.value.find(a => a.id === activeId.value) ?? null
  })

  const savedAccounts = computed<SavedAccount[]>(() =>
    allAccounts.value.filter(a => a.id !== activeId.value),
  )

  const isAtCap = computed<boolean>(() => isAtCapFn(addresses.value))

  const addAccount = (
    account: SavedAccount,
  ): { added: boolean; reason?: 'cap' } => {
    if (!canAdd(addresses.value, account.chainType, account.address)) return { added: false, reason: 'cap' }
    const entry: PersistedEntry = {
      address: account.address,
      walletName: account.walletName,
      chain: { type: account.chainType, name: account.chainType } as any,
      type: account.chainType,
      walletType: account.providerType,
      addressName: account.addressName,
    }
    addresses.value = upsertEntry(addresses.value, entry)
    return { added: true }
  }

  const removeAccount = (id: string): void => {
    const account = allAccounts.value.find(a => a.id === id)
    if (!account) return
    addresses.value = removeEntry(addresses.value, account.chainType, account.address)
  }

  /**
   * Build a SavedAccount from the current live wallet + selected chain.
   * Returns null if nothing is connected.
   */
  const captureActiveAccount = (): SavedAccount | null => {
    const address = walletStore.walletAddress
    const chain = chainsStore.selectedChain
    if (!address || !chain) return null
    const chainType = chain.type as ChainType
    const walletName = walletStore.walletName
    const config = Object.values(walletConfigs).find(c => c.name === walletName)
    return {
      id: buildId(chainType, address),
      address,
      chainType,
      kind: walletStore.isWatchOnly ? 'watchOnly' : 'signing',
      walletConfigType: config?.type?.[0] ?? WalletConfigType.SOFTWARE,
      providerType: walletStore.wallet?.getWalletType() as WalletType,
      connectorId: config?.id,
      walletName: walletName || address,
      addressName: '',
      icon: typeof config?.icon === 'string' ? config.icon : '',
    }
  }

  /** One-shot: seed from existing watch-only recents + the current active wallet. */
  const backfill = (): void => {
    const { watchOnlyAddresses } = useWatchOnlyStore()
    let seeded: RecentAddress = { EVM: [], BITCOIN: [] }
    ;(['EVM', 'BITCOIN'] as ChainType[]).forEach(type => {
      ;(watchOnlyAddresses[type] ?? []).forEach((w: PersistedEntry) => {
        const entry: PersistedEntry = {
          address: w.address,
          walletName: w.walletName || w.address,
          chain: w.chain,
          type,
          walletType: w.walletType,
          addressName: w.addressName || '',
        }
        seeded = upsertEntry(seeded, entry)
      })
    })
    const current = captureActiveAccount()
    if (current) {
      const entry: PersistedEntry = {
        address: current.address,
        walletName: current.walletName,
        chain: { type: current.chainType, name: current.chainType } as any,
        type: current.chainType,
        walletType: current.providerType,
        addressName: current.addressName || '',
      }
      seeded = upsertEntry(seeded, entry)
    }
    // merge: keep existing, add new from seeded that don't exist
    let merged = addresses.value
    flatten(seeded).forEach(e => {
      merged = upsertEntry(merged, e)
    })
    addresses.value = backfillNames(merged)
  }

  return {
    addresses,
    activeId,
    activeAccount,
    allAccounts,
    savedAccounts,
    isAtCap,
    addAccount,
    removeAccount,
    captureActiveAccount,
    backfill,
  }
})
