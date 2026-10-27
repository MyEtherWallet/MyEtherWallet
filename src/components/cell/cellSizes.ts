import type { AvatarSize } from '@/components/avatar/types'
import type { IconName } from '@/components/icon/icons'

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
