/**
 * Chip design-library types + tokens (Figma: MEW Web App — Design Library › Chip,
 * node 3280-20635). Centralized so AppChip and its preview read one source of
 * truth instead of restating the Figma values inline.
 */
export type ChipSurface = 'default' | 'alternative'

/**
 * Resting fill per surface (Figma "Variant" = base / surface, spelled `surface`
 * here to match Picker + Input). `default` sits on the grey page and fills white
 * (background/alternative); `alternative` sits on a white card and fills the grey
 * `background/default` token. Both share the same hover and pressed fills
 * (`background/default-hover` / `background/default-pressed`), applied as
 * pseudo-states in AppChip.
 */
export const CHIP_SURFACE_BG_CLASS: Record<ChipSurface, string> = {
  default: 'bg-white',
  alternative: 'bg-background-default',
}
