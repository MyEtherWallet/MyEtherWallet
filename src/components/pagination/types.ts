import type { DividerVariant } from '@/components/divider/types'

/**
 * Pagination surface → AppDivider variant (Figma: MEW Web App — Design
 * Library › Pagination, component set 1074:3108). `default` sits on the grey
 * page, `alternative` on a white card. The names are inverted between the two
 * components: Pagination "on default" (grey) draws border/strong, which
 * AppDivider calls `alternative`.
 */
export const PAGINATION_DIVIDER = {
  default: 'alternative',
  alternative: 'default',
} as const satisfies Record<string, DividerVariant>

export type PaginationVariant = keyof typeof PAGINATION_DIVIDER
