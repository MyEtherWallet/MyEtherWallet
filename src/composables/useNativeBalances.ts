import { formatUnits } from 'viem'
import { fetchWithRetry } from '@/mew_api/fetchWithRetry'
import type { AddressBalanceResponse } from '@/mew_api/types'

/**
 * Addresses per request against the batch balance endpoints. Ten keeps the
 * `addresses=` query comfortably inside proxy / CDN URL limits while still
 * turning a page of addresses into a single call.
 */
export const NATIVE_BALANCE_BATCH_SIZE = 10

/** The chain fields the batch endpoints need: name (BTC route), type, chainID
 *  (EVM route). Structural so a full `Chain` or a hand-built object both fit. */
export interface NativeBalanceChain {
  name: string
  type: string
  chainID?: string
}

/** Native-currency decimals per chain family (wei → ETH, sats → BTC). */
const NATIVE_DECIMALS: Record<string, number> = {
  EVM: 18,
  BITCOIN: 8,
}

export const nativeDecimals = (chainType: string): number =>
  NATIVE_DECIMALS[chainType] ?? 18

/** Balance in base units → human-readable native amount (e.g. wei → "1.5"). */
export const formatNativeBalance = (
  baseUnits: bigint,
  chainType: string,
): string => formatUnits(baseUnits, nativeDecimals(chainType))

interface BtcAddressWithBalance {
  address: string
  balance: { nativeValue: string }
}

/** Balances arrive as hex ("0x…") or decimal strings; BigInt parses both. */
const parseBaseUnits = (raw: string | null | undefined): bigint => {
  try {
    return BigInt(raw ?? '0')
  } catch {
    return 0n
  }
}

export const chunk = <T>(items: T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size))
  return out
}

/**
 * Fetch the native-currency balance of many addresses on one chain using the
 * batch endpoints (`/v1/evm/chains/{chainId}/balances` and
 * `/v1/btc/{chainName}/balances`), {@link NATIVE_BALANCE_BATCH_SIZE} addresses
 * per request, batches issued sequentially.
 *
 * This is what address pickers and saved-address lists should call: the
 * per-address `/balances/{chain}/{address}` endpoint returns the full token
 * list with sparklines and is rate limited, so hitting it once per listed
 * address burns the budget for what is only a native-balance preview.
 *
 * @returns lower-cased address → balance in base units (wei / sats). Addresses
 * the API did not return are absent from the map.
 * @throws when any batch request fails, so callers decide how to degrade.
 */
export async function fetchNativeBalances(
  chain: NativeBalanceChain,
  addresses: string[],
): Promise<Map<string, bigint>> {
  const balances = new Map<string, bigint>()
  const unique = [...new Set(addresses.filter(Boolean))]
  if (unique.length === 0) return balances

  for (const batch of chunk(unique, NATIVE_BALANCE_BATCH_SIZE)) {
    const query = `addresses=${batch.join(',')}`
    if (chain.type === 'BITCOIN') {
      const rows = await fetchWithRetry<BtcAddressWithBalance[]>(
        `/v1/btc/${chain.name}/balances?${query}`,
      )
      for (const row of rows ?? []) {
        balances.set(
          row.address.toLowerCase(),
          parseBaseUnits(row.balance?.nativeValue),
        )
      }
    } else {
      if (!chain.chainID) {
        throw new Error(`Missing chainID for ${chain.name} balance lookup`)
      }
      const rows = await fetchWithRetry<AddressBalanceResponse[]>(
        `/v1/evm/chains/${chain.chainID}/balances?${query}`,
      )
      for (const row of rows ?? []) {
        balances.set(row.address.toLowerCase(), parseBaseUnits(row.value))
      }
    }
  }
  return balances
}
