import type { AvatarIconTone } from '@/components/avatar/types'
import type { IconName } from '@/components/icon/icons'

/**
 * Toast design-library types (Figma: MEW Web App — Design Library › ↳ Toast,
 * component set 2680:45751).
 */
export const TOAST_TYPES = [
  'processing',
  'transaction-completed',
  'warning',
  'success',
  'error',
  'info',
] as const
export type ToastType = (typeof TOAST_TYPES)[number]

/** Figma only gives these four a `Show Button`. */
export const TOAST_TYPES_WITH_BUTTON: readonly ToastType[] = [
  'transaction-completed',
  'warning',
  'success',
  'error',
]

/** Status types lead with an Avatar Icon: solid tone + stroke glyph. */
export const TOAST_STATUS_AVATAR: Record<
  Exclude<ToastType, 'processing' | 'transaction-completed'>,
  { tone: AvatarIconTone; icon: IconName }
> = {
  warning: { tone: 'warning', icon: 'exclamation-circle' },
  success: { tone: 'success', icon: 'check-circle' },
  error: { tone: 'error', icon: 'exclamation-circle' },
  info: { tone: 'info', icon: 'information-circle' },
}

/** Warnings and errors interrupt; the rest are announced politely. */
export const TOAST_ROLE: Record<ToastType, 'status' | 'alert'> = {
  processing: 'status',
  'transaction-completed': 'status',
  success: 'status',
  info: 'status',
  warning: 'alert',
  error: 'alert',
}

/** Received asset shown by `transaction-completed`. */
export interface ToastAsset {
  url?: string | null
  symbol?: string
  isStock?: boolean
}
