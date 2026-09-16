/**
 * Chip design-library types + tokens (Figma: MEW Web App — Design Library › Chip,
 * node 3280-20635). Centralized so AppChip and its preview read one source of
 * truth instead of restating the Figma values inline.
 */
export type ChipVariant = 'base' | 'surface'

/**
 * Resting fill per variant (Figma "Variant"). `base` sits on a coloured surface
 * and fills white (background/alternative); `surface` sits on white and fills the
 * grey `bgBase` token (background/default). Both share the same hover and pressed
 * fills (background/default-hover / -pressed), applied as pseudo-states in AppChip.
 */
export const CHIP_VARIANT_BG_CLASS: Record<ChipVariant, string> = {
  base: 'bg-white',
  surface: 'bg-bgBase',
}
