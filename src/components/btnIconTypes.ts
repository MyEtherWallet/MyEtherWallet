import type { IconSize } from '@/components/icon/icons'

/**
 * Button Icon design-library geometry + styles (Figma: MEW Web App — Design
 * Library › Button Icon, component set 82:15271, size wrapper `_base / Button
 * Icon` 1519:7534). AppBtnIcon and its /dev preview read from here so a token
 * tweak lands in one place.
 *
 * Box and glyph are tied per size: S 22/16 (3px pad), M 32/24, L 40/32 (4px
 * pad). S is off the size scale, a documented Figma exception like avatar XS
 * 18 / badge 22, so don't round it to 24.
 */
export const BTN_ICON_SIZE = {
  s: { box: 'size-[22px]', icon: 'xxs' },
  m: { box: 'size-8', icon: 'm' },
  l: { box: 'size-10', icon: 'l' },
} as const satisfies Record<string, { box: string; icon: IconSize }>

export type BtnIconSize = keyof typeof BTN_ICON_SIZE

/**
 * One static class string per Figma Style, so the Tailwind scan sees every
 * class. Hover and pressed are gated on `not-disabled:` (disabled keeps
 * pointer events so a wrapping tooltip still works). Naked and filled don't
 * set a color: the glyph inherits currentColor, so a caller tint like
 * `text-text-brand` still applies. Contrast styles sit on dark surfaces and
 * force the inverted icon color.
 */
export const BTN_ICON_VARIANT_CLASS = {
  naked:
    'not-disabled:hover:bg-background-alternative-hover not-disabled:active:bg-background-alternative-pressed',
  'naked-contrast':
    'text-icon-inverted not-disabled:hover:bg-background-contrast-hover not-disabled:active:bg-background-contrast-pressed',
  filled:
    'bg-background-default not-disabled:hover:bg-background-default-hover not-disabled:active:bg-background-default-pressed disabled:bg-background-disabled focus-visible:bg-background-disabled',
  'filled-contrast':
    'bg-background-contrast-default text-icon-inverted not-disabled:hover:bg-background-contrast-hover not-disabled:active:bg-background-contrast-pressed disabled:bg-background-contrast-disabled focus-visible:bg-background-contrast-hover',
} as const

export type BtnIconVariant = keyof typeof BTN_ICON_VARIANT_CLASS
