/**
 * Avatar design-system types + size tables (Figma: MEW Web App — Design Library
 * › Avatars, component set 1286:489).
 *
 * Everything geometric lives here so the parent and children read one source of
 * truth instead of recomputing box math per component.
 */

export type AvatarType =
  | 'wallet'
  | 'stocks'
  | 'network'
  | 'perpsAsset'
  | 'cryptoAsset'
  | 'icon'
  | 'account'
  | 'initial'

export type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl'

export type AvatarBadgeType = 'network' | 'icon' | 'status'

/** Status-dot colors — mapped to the theme's semantic tokens in AvatarStatusDot. */
export type AvatarStatus = 'error' | 'warning' | 'success' | 'muted'

/**
 * Badge corners, 1:1 with the Figma parent booleans:
 *   top → top-right · bottom → bottom-right · topLeft → top-left · bottomLeft → bottom-left
 * Guideline mapping: network → bottom, icon → topLeft, status → top.
 */
export type AvatarBadgePosition = 'top' | 'bottom' | 'topLeft' | 'bottomLeft'

/**
 * Payment-method marks for AppAvatarCard (Avatar-Cards, node 520:3673). A
 * rectangular card, separate from the circular Avatar system.
 */
export type PaymentMethod =
  | 'applePay'
  | 'gPay'
  | 'masterCard'
  | 'paypal'
  | 'pix'
  | 'visa'

interface AvatarSizeSpec {
  /** Avatar box (px), width = height, perfect circle. */
  box: number
  /**
   * Network / Icon badge box (px). A per-size lookup, not a formula (it is not a
   * clean ratio of the avatar box). The Status badge does NOT use this — it is a
   * fixed 8px at every size (see STATUS_BADGE_BOX).
   */
  badgeBox: number
}

export const AVATAR_SIZES: Record<AvatarSize, AvatarSizeSpec> = {
  xs: { box: 18, badgeBox: 12 },
  s: { box: 24, badgeBox: 14 },
  m: { box: 32, badgeBox: 18 },
  l: { box: 40, badgeBox: 20 },
  xl: { box: 48, badgeBox: 22 },
}

/** Badge overhangs the avatar by badgeBox × this on every corner (Figma). */
export const BADGE_OVERHANG_RATIO = 0.22

export const badgeOffset = (size: AvatarSize): number =>
  AVATAR_SIZES[size].badgeBox * BADGE_OVERHANG_RATIO

/** The Status badge is a fixed 8px at every avatar size (design). */
export const STATUS_BADGE_BOX = 8

/** Fallback-initials text size per avatar box (Tailwind), for remote-logo types. */
export const AVATAR_FALLBACK_TEXT_CLASS: Record<AvatarSize, string> = {
  xs: 'text-[8px]',
  s: 'text-[10px]',
  m: 'text-s-12',
  l: 'text-s-14',
  xl: 'text-s-16',
}

/**
 * Absolute placement + box for a badge at a given corner. Generalized from the
 * Figma M reference: top-right `top:-3.96 left:17.96` where 17.96 = box - badgeBox + offset.
 */
export const badgePositionStyle = (
  size: AvatarSize,
  position: AvatarBadgePosition,
): Record<string, string> => {
  const { box, badgeBox } = AVATAR_SIZES[size]
  const offset = badgeOffset(size)
  const near = -offset
  const far = box - badgeBox + offset
  const top = position === 'top' || position === 'topLeft' ? near : far
  const left = position === 'topLeft' || position === 'bottomLeft' ? near : far
  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${badgeBox}px`,
    height: `${badgeBox}px`,
  }
}
