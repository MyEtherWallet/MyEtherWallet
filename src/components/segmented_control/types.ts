import type { AvatarSize } from '@components/avatar/types'
import type { IconName } from '@components/icon/icons'

export type SegmentSize = 'default' | 'small'

export interface SegmentItem<TValue extends string = string> {
  value: TValue
  label: string
  trailingIcon?: IconName
}

/**
 * Segment / _Base (274:2783) per size: 40 / 28 tall, leading avatar 24 (s) /
 * 18 (xs). Hover is bound to background/default at the default size — the same
 * grey as the track, so it shows no change inside the control — and to
 * background/alternative-hover at small. Design-confirmed; keep as bound.
 */
export const SEGMENT_SIZE: Record<
  SegmentSize,
  { box: string; hover: string; avatar: AvatarSize }
> = {
  default: {
    box: 'h-10 px-2',
    hover: 'hover:bg-background-default',
    avatar: 's',
  },
  small: {
    box: 'h-7 px-1.5',
    hover: 'hover:bg-background-alternative-hover',
    avatar: 'xs',
  },
}
