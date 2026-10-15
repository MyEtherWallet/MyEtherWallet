import type { DividerVariant } from '@/components/divider/types'

/**
 * Pagination design-library types (Figma: MEW Web App — Design Library ›
 * Pagination, component set 1074:3108). `default` sits on the grey page,
 * `alternative` on a white card.
 */
export const PAGINATION_VARIANTS = ['default', 'alternative'] as const
export type PaginationVariant = (typeof PAGINATION_VARIANTS)[number]

/**
 * Pagination surface → AppDivider variant. The names are inverted between the
 * two components: Pagination "on default" (grey) draws border/strong, which
 * AppDivider calls `alternative`.
 */
export const PAGINATION_DIVIDER: Record<PaginationVariant, DividerVariant> = {
  default: 'alternative',
  alternative: 'default',
}
