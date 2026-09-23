/**
 * Avatar design-system types + size tables (Figma: MEW Web App — Design Library
 * › Avatars, component set 1286:489).
 *
 * Everything geometric lives here so the parent and children read one source of
 * truth instead of recomputing box math per component.
 *
 * On-scale boxes reference `SIZE[token]` (MEW-2364) so a scale change lands
 * here too; the off-scale ones (Avatar XS box 18, M/XL badges 18/22) are Figma
 * component geometry and stay literals — see the exception comments below.
 */
import { SIZE } from '@/components/sizeScale'

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
  xs: { box: 18, badgeBox: SIZE[3] }, // box 18 off-scale: Figma Avatar XS (no size/4.5)
  s: { box: SIZE[6], badgeBox: SIZE[3.5] },
  m: { box: SIZE[8], badgeBox: 18 }, // badge 18 off-scale: Figma Avatar M badge
  l: { box: SIZE[10], badgeBox: SIZE[5] },
  xl: { box: SIZE[12], badgeBox: 22 }, // badge 22 off-scale: Figma Avatar XL badge
}

/** Badge overhangs the avatar by badgeBox × this on every corner (Figma). */
export const BADGE_OVERHANG_RATIO = 0.22

export const badgeOffset = (size: AvatarSize): number =>
  AVATAR_SIZES[size].badgeBox * BADGE_OVERHANG_RATIO

/** The Status badge is a fixed 8px at every avatar size (design). */
export const STATUS_BADGE_BOX = SIZE[2] // 8

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
