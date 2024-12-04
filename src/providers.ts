export const Provider = {
  ANALYTICS: 'ANALYTICS'
} as const
export type Provider = typeof Provider[keyof typeof Provider]
