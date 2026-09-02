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

/** Cached shape: the balance plus when it was fetched, for TTL/staleness checks. */
interface CachedBalance extends AccountBalance {
  fetchedAt: number
}

export interface BalanceEntry {
  chainName: string
  address: string
  /** Native-currency fiat price for the active chain — the /balances response returns
   *  price: null for the native token, so callers pass the chain's price to value it. */
  nativePrice?: number
}

/** How long a cached balance is considered fresh before a visible row re-fetches it. */
export const BALANCE_TTL_MS = 75 * 1000

/** The MEW API's sentinel contract for a chain's native currency (ETH, BNB, …). */
const NATIVE_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const STORAGE_KEY = 'multiAddressBalances'

/** Cache key: per chain (name) + address, so each network keeps its own balance
 *  snapshot and in-flight entry — the selected network's value is always shown,
 *  never another chain's. Fetch traffic is bounded by the (short) TTL plus the
 *  viewport/while-open refresh in the popup rather than by a shared cache identity.
 *  Lower-cased for stable matching. */
const cacheKey = (chainName: string, address: string): string =>
  `${chainName.toLowerCase()}:${address.toLowerCase()}`

/**
 * Per-address balance cache for the Manage Accounts popup.
 *
 * Balances are persisted to localStorage and keyed by (chainName, address). The
 * active account is live (walletStore); every other saved address is fetched only
 * when it becomes visible in the popup viewport AND is missing or older than the
 * TTL (`fetchIfStale`), or on an explicit per-row refresh (`refreshOne`). This
 * bounds fetching to what the user is actually looking at.
 */
export function useAccountBalances() {
  const cache = useLocalStorage<Record<string, CachedBalance>>(STORAGE_KEY, {})
  // Keys currently being fetched, so a row re-entering the viewport (or a network
  // re-trigger) doesn't fire a duplicate request. Reassigned (not mutated) so
  // `loadingFor` reads stay reactive.
  const inFlight = ref<Set<string>>(new Set())

  const cached = (
    chainName: string,
    address: string,
  ): AccountBalance | undefined => {
    const e = cache.value[cacheKey(chainName, address)]
    return e ? { usdValue: e.usdValue, tokenCount: e.tokenCount } : undefined
  }

  /** True when the address has no cached balance or its cache is older than `ttl`. */
  const isStale = (
    chainName: string,
    address: string,
    ttl: number = BALANCE_TTL_MS,
  ): boolean => {
    const e = cache.value[cacheKey(chainName, address)]
    return !e || Date.now() - e.fetchedAt >= ttl
  }

  const loadingFor = (chainName: string, address: string): boolean =>
    inFlight.value.has(cacheKey(chainName, address))

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

  const store = (key: string, balance: AccountBalance): void => {
    cache.value = { ...cache.value, [key]: { ...balance, fetchedAt: Date.now() } }
  }

  /** Fetch one entry with in-flight dedupe, writing the result (and timestamp) to
   *  the cache. Shared by `fetchIfStale` (TTL-gated) and `refreshOne` (forced). */
  const runFetch = async (entry: BalanceEntry): Promise<void> => {
    const key = cacheKey(entry.chainName, entry.address)
    if (inFlight.value.has(key)) return
    inFlight.value = new Set(inFlight.value).add(key)
    try {
      store(key, await fetchOne(entry))
    } finally {
      const next = new Set(inFlight.value)
      next.delete(key)
      inFlight.value = next
    }
  }

  /** Fetch only when the entry is missing or older than `ttl` (viewport-driven). */
  const fetchIfStale = async (
    entry: BalanceEntry,
    ttl: number = BALANCE_TTL_MS,
  ): Promise<void> => {
    if (!isStale(entry.chainName, entry.address, ttl)) return
    await runFetch(entry)
  }

  /** Force a fresh fetch of one entry (per-row refresh / on save) and cache it. */
  const refreshOne = async (entry: BalanceEntry): Promise<void> => {
    await runFetch(entry)
  }

  /** Seed a known balance (e.g. the live active-account balance) into the cache so
   *  it's available without a fetch once that address becomes non-active. */
  const set = (
    chainName: string,
    address: string,
    balance: AccountBalance,
  ): void => {
    store(cacheKey(chainName, address), balance)
  }

  return { cached, isStale, loadingFor, fetchIfStale, refreshOne, set }
}
