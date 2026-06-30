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
  upsert,
  canAdd,
  isAtCap as isAtCapFn,
  removeById,
  backfillMerge,
  type SavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'

export const useSavedAccountsStore = defineStore('savedAccountsStore', () => {
  const accounts = useLocalStorage<SavedAccount[]>('savedAccounts', [], {
    mergeDefaults: true,
  })

  const walletStore = useWalletStore()
  const chainsStore = useChainsStore()

  const activeId = computed<string | null>(() => {
    const address = walletStore.walletAddress
    const chainType = chainsStore.selectedChain?.type as ChainType | undefined
    if (!address || !chainType) return null
    return buildId(chainType, address)
  })

  const activeAccount = computed<SavedAccount | null>(() => {
    if (!activeId.value) return null
    return accounts.value.find(a => a.id === activeId.value) ?? null
  })

  const savedAccounts = computed<SavedAccount[]>(() =>
    accounts.value
      .filter(a => a.id !== activeId.value)
      .sort((a, b) => a.addedAt - b.addedAt),
  )

  const isAtCap = computed<boolean>(() => isAtCapFn(accounts.value))

  const addAccount = (
    account: SavedAccount,
  ): { added: boolean; reason?: 'cap' } => {
    if (!canAdd(accounts.value, account)) return { added: false, reason: 'cap' }
    accounts.value = upsert(accounts.value, account)
    return { added: true }
  }

  const removeAccount = (id: string): void => {
    accounts.value = removeById(accounts.value, id)
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
      icon: typeof config?.icon === 'string' ? config.icon : '',
      addedAt: Date.now(),
    }
  }

  /** One-shot: seed from existing watch-only recents + the current active wallet. */
  const backfill = (): void => {
    const { watchOnlyAddresses } = useWatchOnlyStore()
    const seeds: SavedAccount[] = []
    ;(['EVM', 'BITCOIN'] as ChainType[]).forEach(type => {
      ;(watchOnlyAddresses[type] ?? []).forEach((w: any) => {
        seeds.push({
          id: buildId(type, w.address),
          address: w.address,
          chainType: type,
          kind: 'watchOnly',
          walletConfigType:
            (w.type as WalletConfigType) ?? WalletConfigType.SOFTWARE,
          providerType: w.walletType as WalletType,
          connectorId: undefined,
          walletName: w.walletName || w.address,
          icon: '',
          addedAt: Date.now(),
        })
      })
    })
    const current = captureActiveAccount()
    if (current) seeds.push(current)
    accounts.value = backfillMerge(accounts.value, seeds)
  }

  return {
    accounts,
    activeId,
    activeAccount,
    savedAccounts,
    isAtCap,
    addAccount,
    removeAccount,
    captureActiveAccount,
    backfill,
  }
})
