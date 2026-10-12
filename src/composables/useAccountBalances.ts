// src/composables/useAccountBalances.ts
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { formatUnits } from 'viem'
import {
  fetchNativeBalances,
  nativeDecimals,
} from '@/composables/useNativeBalances'

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
  /** Native-currency fiat price for the chain — the batch endpoints return raw
   *  native balances only, so callers pass the chain's price to value them. */
  nativePrice?: number
  /** EVM chain id; required to route EVM chains to `/v1/evm/chains/{chainId}/balances`. */
  chainId?: string
  /** 'EVM' | 'BITCOIN' — picks the batch endpoint and native decimals. Defaults to EVM. */
  chainType?: string
}

/** How long a cached balance is considered fresh before a visible row re-fetches it. */
export const BALANCE_TTL_MS = 75 * 1000

/** Requests for the same chain arriving within this window share one batch call. */
export const BALANCE_BATCH_WINDOW_MS = 50

const STORAGE_KEY = 'multiAddressBalances'

/** Cache key: per chain (name) + address, so each network keeps its own balance
 *  snapshot and in-flight entry — the selected network's value is always shown,
 *  never another chain's. Fetch traffic is bounded by the (short) TTL plus the
 *  viewport/while-open refresh in the popup rather than by a shared cache identity.
 *  Lower-cased for stable matching. */
const cacheKey = (chainName: string, address: string): string =>
  `${chainName.toLowerCase()}:${address.toLowerCase()}`

interface PendingBatch {
  entries: Map<string, BalanceEntry>
  done: Promise<void>
  resolve: () => void
}

/**
 * Per-address balance cache for the Manage Accounts popup.
 *
 * Balances are persisted to localStorage and keyed by (chainName, address). The
 * active account is live (walletStore); every other saved address is fetched only
 * when it becomes visible in the popup viewport AND is missing or older than the
 * TTL (`fetchIfStale`), or on an explicit per-row refresh (`refreshOne`). This
 * bounds fetching to what the user is actually looking at.
 *
 * Fetches are batched: every request for the same chain that lands within
 * `BALANCE_BATCH_WINDOW_MS` is folded into one call to the batch balance
 * endpoint (10 addresses per request) instead of one rate-limited per-address
 * token-list call each. The value shown is therefore the native-currency
 * balance priced in fiat, not the full token portfolio.
 */
export function useAccountBalances() {
  const cache = useLocalStorage<Record<string, CachedBalance>>(STORAGE_KEY, {})
  // Keys currently being fetched, so a row re-entering the viewport (or a network
  // re-trigger) doesn't fire a duplicate request. Reassigned (not mutated) so
  // `loadingFor` reads stay reactive.
  const inFlight = ref<Set<string>>(new Set())
  const inFlightBatch = new Map<string, PendingBatch>()
  const pendingByChain = new Map<string, PendingBatch>()

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

  const store = (key: string, balance: AccountBalance): void => {
    cache.value = { ...cache.value, [key]: { ...balance, fetchedAt: Date.now() } }
  }

  const toAccountBalance = (
    baseUnits: bigint | undefined,
    entry: BalanceEntry,
  ): AccountBalance => {
    const balance = Number(
      formatUnits(baseUnits ?? 0n, nativeDecimals(entry.chainType ?? 'EVM')),
    )
    return {
      usdValue: balance > 0 ? balance * Number(entry.nativePrice ?? 0) : 0,
      tokenCount: balance > 0 ? 1 : 0,
    }
  }

  /** Fire the batch collected for one chain: a single request (per 10 addresses),
   *  every entry written to the cache (zero on failure, so a row never spins forever). */
  const flushChain = async (chainName: string): Promise<void> => {
    const batch = pendingByChain.get(chainName)
    if (!batch) return
    pendingByChain.delete(chainName)
    const entries = [...batch.entries.values()]
    const first = entries[0]
    try {
      const balances = await fetchNativeBalances(
        {
          name: chainName,
          type: first.chainType ?? 'EVM',
          chainID: first.chainId,
        },
        entries.map(e => e.address),
      )
      for (const entry of entries) {
        store(
          cacheKey(entry.chainName, entry.address),
          toAccountBalance(balances.get(entry.address.toLowerCase()), entry),
        )
      }
    } catch {
      for (const entry of entries) {
        store(cacheKey(entry.chainName, entry.address), {
          usdValue: 0,
          tokenCount: 0,
        })
      }
    } finally {
      const next = new Set(inFlight.value)
      for (const key of batch.entries.keys()) {
        next.delete(key)
        inFlightBatch.delete(key)
      }
      inFlight.value = next
      batch.resolve()
    }
  }

  /** Queue one entry into its chain's pending batch (with in-flight dedupe) and
   *  resolve when that batch has been written to the cache. Shared by
   *  `fetchIfStale` (TTL-gated) and `refreshOne` (forced). */
  const runFetch = (entry: BalanceEntry): Promise<void> => {
    const key = cacheKey(entry.chainName, entry.address)
    const alreadyRunning = inFlightBatch.get(key)
    if (alreadyRunning) return alreadyRunning.done

    let batch = pendingByChain.get(entry.chainName)
    if (!batch) {
      let resolve!: () => void
      const done = new Promise<void>(r => (resolve = r))
      batch = { entries: new Map(), done, resolve }
      pendingByChain.set(entry.chainName, batch)
      setTimeout(() => void flushChain(entry.chainName), BALANCE_BATCH_WINDOW_MS)
    }
    batch.entries.set(key, entry)
    inFlightBatch.set(key, batch)
    inFlight.value = new Set(inFlight.value).add(key)
    return batch.done
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
