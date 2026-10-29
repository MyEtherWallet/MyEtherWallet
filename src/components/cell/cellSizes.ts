import type { AvatarSize } from '@/components/avatar/types'
import type { IconName } from '@/components/icon/icons'
import { formatPercentageValue } from '@/utils/numberFormatHelper'

/**
 * Cell geometry (Figma: MEW Web App — Design Library › Cell, Size axis).
 * Heights are Figma component geometry and sit off the size scale (68 / 52 are
 * not `sizeScale.ts` tokens), so they stay literals like the Avatar XS box.
 */
export const CELL_SIZES = ['medium', 'small'] as const

export type CellSize = (typeof CELL_SIZES)[number]

type CellSizeSpec = {
  /** Fixed row height + vertical padding. */
  cell: string
  /** Avatar size handed to the `avatar` slot. */
  avatar: AvatarSize
}

export const CELL_SIZE_SPEC: Record<CellSize, CellSizeSpec> = {
  medium: { cell: 'h-[68px] py-3', avatar: 'l' }, // Figma Size=Default
  small: { cell: 'h-[52px] py-1', avatar: 'm' }, // Figma Size=Small
}

/**
 * InfoCell geometry (Figma: ↳ InfoCell, component set 2656:30288). Its own box,
 * not the Cell's: M 74 (padding 16, gap 12, avatar L 40), S 30 (padding 4 / 16,
 * gap 8, avatar XS 18). The loading row keeps the loaded height. Off the size
 * scale like the Cell heights.
 */
export const INFO_CELL_SIZE_SPEC: Record<CellSize, CellSizeSpec> = {
  medium: { cell: 'h-[74px] p-4 gap-3', avatar: 'l' },
  small: { cell: 'h-[30px] px-4 py-1 gap-2', avatar: 'xs' },
}

/**
 * Figma "Style" — which surface the cell sits on. Spelled `surface` to match
 * Chip, Picker and Input. `default` sits on the grey page and fills white
 * (background/alternative); `alternative` sits on a white card and fills the
 * grey background/default. Hover / pressed step through the matching
 * `*-hover` / `*-pressed` tokens of the same family.
 */
export type CellSurface = 'default' | 'alternative'

export const CELL_SURFACE_BG_CLASS: Record<CellSurface, string> = {
  default: 'bg-background-alternative',
  alternative: 'bg-background-default',
}

export const CELL_SURFACE_INTERACTIVE_CLASS: Record<CellSurface, string> = {
  default:
    'hover:bg-background-alternative-hover active:bg-background-alternative-pressed',
  alternative:
    'hover:bg-background-default-hover active:bg-background-default-pressed',
}

/**
 * Right accessory (Figma: Cell › `_right accesory / _base`, set 1058:908). The
 * nine Figma variants collapse to a `kind` plus the data it needs. Up / down
 * comes from the sign of `change` (zero is neutral), so the colour can't
 * disagree with the number; a graph derives it from its first vs last point
 * unless `trend` says otherwise. `icon` is a static glyph slot, the Cell
 * itself owns selection and clicks.
 */
export type CellRightAccessory =
  | { kind: 'balance'; primary: string; secondary?: string }
  | { kind: 'balance-performance'; primary: string; change: number }
  | { kind: 'performance'; change: number }
  | { kind: 'graph'; points: number[]; trend?: 'up' | 'down' }
  | { kind: 'icon'; icon: IconName }
  | { kind: 'loading' }

export type Trend = 'up' | 'down' | 'neutral'

export const trendOf = (change: number): Trend =>
  change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

/** A change as Figma writes it: +2.87%, −2.87% (U+2212), 0.00%. */
export const formatChange = (change: number): string => {
  const trend = trendOf(change)
  // The shared formatter returns a bare '0' here; Figma wants 0.00%.
  if (trend === 'neutral') return '0.00%'
  // It keeps the sign, bounds included ('> -0.01%', '< -1000%').
  const value = formatPercentageValue(change).value.replace('-', '−')
  // A '+' in front of a bound would read '+< 0.01%'.
  return trend === 'up' && !/^[<>]/.test(value) ? `+${value}` : value
}
