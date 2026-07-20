export const SENTRY_MODULE_TAGS = {
  ACCESS: { tags: { module: 'access' } },
  SWAP: { tags: { module: 'swap' } },
  TRADE: { tags: { module: 'trade' } },
  SEND: { tags: { module: 'send' } },
  NOTIFICATIONS: { tags: { module: 'notifications' } },
  PORTFOLIO: { tags: { module: 'portfolio' } },
  PERPS: { tags: { module: 'perps' } },
} as const
