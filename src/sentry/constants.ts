export const SENTRY_MODULE_TAGS = {
  ACCESS: { tags: { module: 'access' } },
  SWAP: { tags: { module: 'swap' } },
  TRADE: { tags: { module: 'trade' } },
  SEND: { tags: { module: 'send' } },
  NOTIFICATIONS: { tags: { module: 'notifications' } },
  PORTFOLIO: { tags: { module: 'portfolio' } },
  PERPS: { tags: { module: 'perps' } },
} as const

/**
 * Per-feature axis for the perps module. `module: 'perps'` stays intact so
 * existing Sentry searches and alerts keep working; `feature` narrows within it
 * (`feature:order`, `feature:withdraw`, …) and mirrors the analytics taxonomy in
 * `analytics/events.ts`. Applied via `perpsTags()` (see `modules/perps/sentry.ts`).
 */
export const PERPS_FEATURE = {
  AUTH: 'auth',
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  ORDER: 'order',
  POSITION: 'position',
  LEVERAGE: 'leverage',
  TPSL: 'tpsl',
  MARKETS: 'markets',
  PORTFOLIO: 'portfolio',
  HISTORY: 'history',
  TRANSPORT: 'transport',
  STATUS: 'status',
} as const

export type PerpsFeature = (typeof PERPS_FEATURE)[keyof typeof PERPS_FEATURE]

/** `module:perps` + `feature:<feature>` tags for a Sentry capture context. */
export const perpsTags = (feature: PerpsFeature) => ({
  tags: { ...SENTRY_MODULE_TAGS.PERPS.tags, feature },
})
