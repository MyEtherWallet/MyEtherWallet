/**
 * Avatar design-system types + size tables (Figma: MEW Web App — Design Library
 * › Avatars, component set 1286:489).
 *
 * Everything geometric lives here so the parent and children read one source of
 * truth instead of recomputing box math per component.
 *
 * On-scale boxes reference `SIZE[token]` (MEW-2364) so a scale change lands
 * here too; the off-scale ones (Avatar XS box 18, L badge 22) are Figma
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

/** Icon badge fill: grey by default; `contrast` is the dark (#222) selected check. */
export type AvatarBadgeTone = 'default' | 'contrast'

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
   * Network / Icon badge box (px), border included. A per-size lookup, not a
   * formula (it is not a clean ratio of the avatar box). The 1px white border
   * sits inside this box (box-border), so e.g. m renders a 20px badge over an
   * 18px logo. The Status badge does NOT use this — it is a fixed 10px at every
   * size (see STATUS_BADGE_BOX).
   */
  badgeBox: number
}

// Boxes include the 1px white border (2px total), so the visible badge matches
// the Figma spec (badge + border): 18px logo → 20px badge at m, etc.
export const AVATAR_SIZES: Record<AvatarSize, AvatarSizeSpec> = {
  xs: { box: 18, badgeBox: SIZE[3.5] }, // box 18 off-scale: Figma Avatar XS (no size/4.5)
  s: { box: SIZE[6], badgeBox: SIZE[4] },
  m: { box: SIZE[8], badgeBox: SIZE[5] },
  l: { box: SIZE[10], badgeBox: 22 }, // badge 22 off-scale: Figma Avatar L badge + border
  xl: { box: SIZE[12], badgeBox: SIZE[6] },
}

/** Badge overhangs the avatar by badgeBox × this on every corner (Figma). */
export const BADGE_OVERHANG_RATIO = 0.22

export const badgeOffset = (size: AvatarSize): number =>
  AVATAR_SIZES[size].badgeBox * BADGE_OVERHANG_RATIO

/** The Status badge is a fixed 10px at every avatar size (design; border included). */
export const STATUS_BADGE_BOX = SIZE[2.5] // 10

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
 * Figma M reference: top-right `top:-4.4 left:16.4` where 16.4 = box - badgeBox + offset.
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
