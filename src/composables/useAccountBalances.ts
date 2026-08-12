// src/composables/useAccountBalances.ts
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { fetchWithRetry } from '@/mew_api/fetchWithRetry'
import type { TokenBalancesRaw } from '@/mew_api/types'
import { formatUnits } from 'viem'

export interface AccountBalance {
  usdValue: number
  tokenCount: number
}

export interface BalanceEntry {
  chainName: string
  address: string
  /** Native-currency fiat price for the active chain — the /balances response returns
   *  price: null for the native token, so callers pass the chain's price to value it. */
  nativePrice?: number
}

/** The MEW API's sentinel contract for a chain's native currency (ETH, BNB, …). */
const NATIVE_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const STORAGE_KEY = 'multiAddressBalances'

/** Cache key: per chain (name) + address so a balance persists across popup opens,
 *  page reloads and network switches. Lower-cased for stable matching. */
const cacheKey = (chainName: string, address: string): string =>
  `${chainName.toLowerCase()}:${address.toLowerCase()}`

/**
 * Per-address balance cache for the Manage Accounts popup.
 *
 * The cache is persisted to localStorage and keyed by (chainName, address). Only
 * the *active* account's balance is live (it comes from walletStore); every other
 * saved address is read from this cache and is only fetched when it isn't cached
 * yet (`fetchMissing`) or on an explicit per-row refresh (`refreshOne`). This
 * avoids re-pulling every address from the API on each popup open / reload.
 */
export function useAccountBalances() {
  const cache = useLocalStorage<Record<string, AccountBalance>>(STORAGE_KEY, {})
  const isLoading = ref(false)

  const cached = (
    chainName: string,
    address: string,
  ): AccountBalance | undefined => cache.value[cacheKey(chainName, address)]

  const fetchOne = async (entry: BalanceEntry): Promise<AccountBalance> => {
    try {
      const res = await fetchWithRetry<TokenBalancesRaw>(
        `/balances/${entry.chainName}/${entry.address}/?noInjectErrors=false&sparklines=true`,
      )
      const result = res.result ?? []
      let usdValue = 0
      let tokenCount = 0
      for (const t of result) {
        // Balances arrive as hex ("0x…") or decimal strings; BigInt parses both.
        let wei: bigint
        try {
          wei = BigInt(t.balance ?? '0')
        } catch {
          continue
        }
        const bal = Number(formatUnits(wei, t.decimals ?? 18))
        if (bal > 0) {
          tokenCount += 1
          const isNative =
            (t.contract ?? '').toLowerCase() === NATIVE_TOKEN_CONTRACT
          const price = isNative
            ? (t.price ?? entry.nativePrice ?? 0)
            : (t.price ?? 0)
          usdValue += bal * Number(price)
        }
      }
      return { usdValue, tokenCount }
    } catch {
      return { usdValue: 0, tokenCount: 0 }
    }
  }

  /** Fetch only the entries not already cached for their chain, then cache them.
   *  Already-cached addresses are never re-fetched here — that's the API saving. */
  const fetchMissing = async (entries: BalanceEntry[]): Promise<void> => {
    const missing = entries.filter(
      e => !cache.value[cacheKey(e.chainName, e.address)],
    )
    if (!missing.length) return
    isLoading.value = true
    try {
      const results = await Promise.all(
        missing.map(
          async e =>
            [cacheKey(e.chainName, e.address), await fetchOne(e)] as const,
        ),
      )
      // Reassign so the record reference changes and dependent bindings re-render.
      cache.value = { ...cache.value, ...Object.fromEntries(results) }
    } finally {
      isLoading.value = false
    }
  }

  /** Force a fresh fetch of one entry (per-row refresh / on save) and cache it. */
  const refreshOne = async (entry: BalanceEntry): Promise<void> => {
    cache.value = {
      ...cache.value,
      [cacheKey(entry.chainName, entry.address)]: await fetchOne(entry),
    }
  }

  /** Seed a known balance (e.g. the live active-account balance) into the cache so
   *  it's available without a fetch once that address becomes non-active. */
  const set = (
    chainName: string,
    address: string,
    balance: AccountBalance,
  ): void => {
    cache.value = { ...cache.value, [cacheKey(chainName, address)]: balance }
  }

  return { isLoading, cached, fetchMissing, refreshOne, set }
}
