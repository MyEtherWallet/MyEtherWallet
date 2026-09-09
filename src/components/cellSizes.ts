export const CELL_SIZES = ['medium', 'small'] as const

export type CellSize = (typeof CELL_SIZES)[number]

type CellSizeSpec = {
  cell: string
  avatar: string
  badge: string
}

export const CELL_SIZE_SPEC: Record<CellSize, CellSizeSpec> = {
  medium: {
    cell: 'h-[68px] py-3',
    avatar: 'size-10',
    badge: 'size-5',
  },
  small: {
    cell: 'h-[52px] py-1',
    avatar: 'size-8',
    badge: 'size-[18px]',
  },
}
