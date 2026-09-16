import type { AvatarSize } from '@/components/avatar/types'

/**
 * Picker design-library types + geometry tables (Figma: MEW Web App — Design
 * Library › Picker, component set 2531:29279).
 *
 * Everything size/token related lives here so AppPicker and its preview read one
 * source of truth instead of restating the Figma numbers inline.
 */
export type PickerSize = 's' | 'm' | 'l'

/**
 * Figma "Style" — which surface the picker is meant to sit on. `default` is for
 * a default (grey) page and fills white; `alternative` sits on a white surface
 * and fills grey. Both darken to the shared `bgBase-hover` fill.
 */
export type PickerSurface = 'default' | 'alternative'

/** Box geometry per size: height · gap · padding · radius (Figma). */
export const PICKER_SIZE_CLASS: Record<PickerSize, string> = {
  s: 'h-8 gap-1 pl-1 pr-2 rounded-full', // 32 · pill, hugs its content
  m: 'h-10 gap-2 px-3 rounded-16', // 40
  l: 'h-16 gap-2 px-4 rounded-16', // 64
}

/** The nested Avatar's size at each Picker size (Figma). */
export const PICKER_AVATAR_SIZE: Record<PickerSize, AvatarSize> = {
  s: 's', // 24px
  m: 's', // 24px
  l: 'm', // 32px
}

/**
 * Resting fill per style. Figma tokens: default = background/alternative (white),
 * alternative = background/default (#f5f5f5 → the `bgBase` token). Hover uses the
 * shared `bgBase-hover` token in AppPicker.
 */
export const PICKER_SURFACE_BG_CLASS: Record<PickerSurface, string> = {
  default: 'bg-white',
  alternative: 'bg-bgBase',
}
