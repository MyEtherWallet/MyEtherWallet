import type { IconName } from '@/components/icon/icons'

/**
 * ScrollFade design-library types (Figma: MEW Web App — Design Library ›
 * ScrollFade, component set 1080:702, specs 3535:116133).
 */
// Same order as the Figma `Side` axis.
export const SCROLL_FADE_SIDES = ['right', 'left', 'top', 'bottom'] as const
export type ScrollFadeSide = (typeof SCROLL_FADE_SIDES)[number]

/** `base` sits on grey (background/default), `surface` on white (background/alternative). */
export const SCROLL_FADE_VARIANTS = ['base', 'surface'] as const
export type ScrollFadeVariant = (typeof SCROLL_FADE_VARIANTS)[number]

/**
 * One static class string per side so the Tailwind scan sees every class.
 * The fade is 114 wide on the horizontal sides and 118 tall on the vertical
 * ones (Figma specs); both are off the size scale, so they stay arbitrary.
 * The gradient is solid at the edge and transparent toward the content.
 */
export const SCROLL_FADE_SIDE_CLASS: Record<
  ScrollFadeSide,
  { position: string; gradient: string; button: string; icon: IconName }
> = {
  left: {
    position: 'inset-y-0 left-0 w-[114px]',
    gradient: 'bg-gradient-to-r',
    button: 'left-0 top-1/2 -translate-y-1/2',
    icon: 'chevron-left',
  },
  right: {
    position: 'inset-y-0 right-0 w-[114px]',
    gradient: 'bg-gradient-to-l',
    button: 'right-0 top-1/2 -translate-y-1/2',
    icon: 'chevron-right',
  },
  top: {
    position: 'inset-x-0 top-0 h-[118px]',
    gradient: 'bg-gradient-to-b',
    button: 'top-0 left-1/2 -translate-x-1/2',
    icon: 'chevron-up',
  },
  bottom: {
    position: 'inset-x-0 bottom-0 h-[118px]',
    gradient: 'bg-gradient-to-t',
    button: 'bottom-0 left-1/2 -translate-x-1/2',
    icon: 'chevron-down',
  },
}

// Figma binds Right / on surface to end at white/80; that's a slip, all eight end transparent.
export const SCROLL_FADE_VARIANT_CLASS: Record<ScrollFadeVariant, string> = {
  base: 'from-background-default to-transparent',
  surface: 'from-background-alternative to-transparent',
}
