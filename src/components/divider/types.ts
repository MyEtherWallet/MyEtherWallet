/**
 * Divider design-library types (Figma: MEW Web App — Design Library › Divider,
 * node 3533:107915). `default` sits on white surfaces, `alternative` on grey.
 */
export const DIVIDER_VARIANTS = ['default', 'alternative'] as const
export type DividerVariant = (typeof DIVIDER_VARIANTS)[number]

export const DIVIDER_CLASS: Record<DividerVariant, string> = {
  default: 'border-border-default',
  alternative: 'border-border-strong',
}
