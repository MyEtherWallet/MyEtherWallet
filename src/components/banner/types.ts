import type { IconName } from '@/components/icon/icons'
import type { IconContainerTone } from '@/components/icon_container/types'

export const BANNER_TYPES = ['info', 'alert', 'success', 'warning'] as const
export type BannerType = (typeof BANNER_TYPES)[number]

export type BannerSurface = 'default' | 'alternative'

/**
 * Container fill per surface (Figma `_base / Banner` "Style", spelled `surface`
 * as in Chip + Picker): `alternative` sits on a white card and fills grey,
 * `default` sits on the grey page and fills white.
 */
export const BANNER_SURFACE_BG_CLASS: Record<BannerSurface, string> = {
  default: 'bg-background-alternative',
  alternative: 'bg-background-default',
}

/**
 * Per type, only the status icon changes (Figma Banner 3740:42238); the
 * container stays grey. Alert and warning interrupt assistive tech, info and
 * success wait their turn.
 */
export const BANNER_TYPE_SPEC: Record<
  BannerType,
  { icon: IconName; tone: IconContainerTone; role: 'status' | 'alert' }
> = {
  info: { icon: 'information-circle', tone: 'info', role: 'status' },
  alert: { icon: 'exclamation-circle', tone: 'error', role: 'alert' },
  success: { icon: 'check-circle', tone: 'success', role: 'status' },
  warning: { icon: 'exclamation-triangle', tone: 'warning', role: 'alert' },
}
