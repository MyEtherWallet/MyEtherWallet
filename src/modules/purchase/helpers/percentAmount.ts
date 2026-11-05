import { formatUnits } from 'viem'

/** Same cap as the amount input, so a preset never yields a value it would reject. */
export const SELL_MAX_DECIMALS = 6

export const SELL_PERCENT_PRESETS = [25, 50, 75, 100] as const

interface PercentAmountOptions {
  /** Raw balance in base units (wei, satoshi, token units). */
  balance: bigint
  decimals: number
  percent: number
  /** Estimated network fee in base units of the native token. */
  fee?: bigint
  isNative: boolean
}

/**
 * Amount for a Sell quick action: `percent` of the balance, rounded down.
 * At 100% of the native token the estimated fee is reserved so the transfer
 * can still pay for gas — same rule as `useMaxAmount` in Send.
 */
export const getPercentAmount = ({
  balance,
  decimals,
  percent,
  fee = 0n,
  isNative,
}: PercentAmountOptions): string => {
  const share = (balance * BigInt(percent)) / 100n
  const reserved = isNative && percent === 100 ? fee : 0n
  const spendable = share > reserved ? share - reserved : 0n
  const [intPart, decPart = ''] = formatUnits(spendable, decimals).split('.')
  const trimmed = decPart.slice(0, SELL_MAX_DECIMALS).replace(/0+$/, '')
  return trimmed ? `${intPart}.${trimmed}` : intPart
}
