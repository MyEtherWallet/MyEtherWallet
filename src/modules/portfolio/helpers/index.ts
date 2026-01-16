export const filters = [
  'all',
  'stocks',
  'earning',
  'custom',
  'watchlist',
] as const

export type BalanceFilter = (typeof filters)[number]
export interface BalanceFilterOption {
  label: string
  value: BalanceFilter
}
export const BALANCE_FILTER = <BalanceFilterOption[]>[
  { label: 'All Tokens', value: 'all' },
  { label: 'Stocks', value: 'stocks' },
  { label: 'Earning Interest', value: 'earning' },
  { label: 'Custom', value: 'custom' },
  { label: 'Watchlist', value: 'watchlist' },
]
