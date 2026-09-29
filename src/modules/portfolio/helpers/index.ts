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
/**
 * `label` is an i18n key (see src/i18n/locales/portfolio). Translate it with
 * `t()` before rendering, e.g. in PortfolioBalance.vue.
 */
export const BALANCE_FILTER = <BalanceFilterOption[]>[
  { label: 'portfolio.filter_all_tokens', value: 'all' },
  { label: 'portfolio.filter_stocks', value: 'stocks' },
  { label: 'portfolio.filter_earning_interest', value: 'earning' },
  { label: 'portfolio.filter_custom', value: 'custom' },
  { label: 'portfolio.filter_watchlist', value: 'watchlist' },
]
