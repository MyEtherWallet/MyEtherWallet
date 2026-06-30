// src/stores/savedAccounts/savedAccountsLogic.ts
import type { WalletConfigType } from '@/modules/access/common/walletConfigs'
import type { ChainType } from '@/mew_api/types'
import type { WalletType } from '@/providers/types/index'

export type SavedAccountKind = 'signing' | 'watchOnly'

export interface SavedAccount {
  /** `${chainType}:${address.toLowerCase()}` — dedupe key */
  id: string
  address: string
  chainType: ChainType
  kind: SavedAccountKind
  /** display/badge category */
  walletConfigType: WalletConfigType
  /** provider identity, for WatchOnlyWallet reconstruction */
  providerType: WalletType
  /** walletConfigs key, for re-opening the connect view (undefined for pure watch-only) */
  connectorId?: string
  walletName: string
  icon: string
  derivationPath?: string
  addedAt: number
}

export const SAVED_ACCOUNTS_CAP = 100

export function buildId(chainType: ChainType, address: string): string {
  return `${chainType}:${address.toLowerCase()}`
}

export function upsert(
  list: SavedAccount[],
  account: SavedAccount,
): SavedAccount[] {
  const idx = list.findIndex(a => a.id === account.id)
  if (idx === -1) return [...list, account]
  const next = [...list]
  next[idx] = { ...account, addedAt: list[idx].addedAt } // preserve original addedAt
  return next
}

export function isAtCap(
  list: SavedAccount[],
  cap: number = SAVED_ACCOUNTS_CAP,
): boolean {
  return list.length >= cap
}

export function canAdd(
  list: SavedAccount[],
  account: SavedAccount,
  cap: number = SAVED_ACCOUNTS_CAP,
): boolean {
  const exists = list.some(a => a.id === account.id)
  if (exists) return true // replace is always allowed
  return !isAtCap(list, cap)
}

export function removeById(list: SavedAccount[], id: string): SavedAccount[] {
  return list.filter(a => a.id !== id)
}

export function promoteNext(
  listAfterRemoval: SavedAccount[],
): SavedAccount | null {
  if (listAfterRemoval.length === 0) return null
  return [...listAfterRemoval].sort((a, b) => a.addedAt - b.addedAt)[0]
}

export function backfillMerge(
  existing: SavedAccount[],
  seeds: SavedAccount[],
): SavedAccount[] {
  const byId = new Map(existing.map(a => [a.id, a]))
  for (const seed of seeds) {
    if (!byId.has(seed.id)) byId.set(seed.id, seed)
  }
  return [...byId.values()]
}
