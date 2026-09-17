import type { AvatarSize } from '@/components/avatar/types'

export const CELL_SIZES = ['medium', 'small'] as const

export type CellSize = (typeof CELL_SIZES)[number]

type CellSizeSpec = {
  cell: string
  avatar: AvatarSize
}

export const CELL_SIZE_SPEC: Record<CellSize, CellSizeSpec> = {
  medium: { cell: 'h-[68px] py-3', avatar: 'l' },
  small: { cell: 'h-[52px] py-1', avatar: 'm' },
}
