/**
 * Tag design-library types + tokens (Figma: MEW Web App — Design Library › Tag,
 * component set 859:624). Centralized so AppTag, its preview and its spec read
 * one source of truth.
 */
export const TAG_TYPES = [
  'success',
  'danger',
  'warning',
  'branded',
  'neutral',
] as const
export type TagType = (typeof TAG_TYPES)[number]

/** Figma "Style" axis, spelled `variant` (like Picker/Button Icon). */
export const TAG_VARIANTS = ['strong', 'subtle', 'contrast'] as const
export type TagVariant = (typeof TAG_VARIANTS)[number]

/**
 * Fill + text colour per Type × Style, one static string per cell so Tailwind's
 * scanner sees every class. Icons inherit the text colour via currentColor.
 * Subtle binds `*-subtle-hover` for danger/warning/branded but plain
 * `success-subtle` for success — that is what Figma binds, copied as is.
 * Contrast is white with no border, meant for coloured or dark surfaces.
 */
export const TAG_CLASSES: Record<TagType, Record<TagVariant, string>> = {
  success: {
    strong: 'bg-background-success text-text-inverted',
    subtle: 'bg-background-success-subtle text-text-success',
    contrast: 'bg-background-alternative text-text-success',
  },
  danger: {
    strong: 'bg-background-error text-text-inverted',
    subtle: 'bg-background-error-subtle-hover text-text-error',
    contrast: 'bg-background-alternative text-text-error',
  },
  warning: {
    strong: 'bg-background-warning text-text-inverted',
    subtle: 'bg-background-warning-subtle-hover text-text-warning',
    contrast: 'bg-background-alternative text-text-warning',
  },
  branded: {
    strong: 'bg-background-brand text-text-inverted',
    subtle: 'bg-background-brand-subtle-hover text-text-brand',
    contrast: 'bg-background-alternative text-text-brand',
  },
  neutral: {
    // neutral/black is theme-fixed, so its text stays white too: text-inverted
    // flips to black in the dark theme and would vanish on it.
    strong: 'bg-black text-white',
    subtle: 'bg-background-default-hover text-text-default',
    contrast: 'bg-background-alternative text-text-default',
  },
}
