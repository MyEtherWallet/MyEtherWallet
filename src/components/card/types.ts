/**
 * Card design-library types + fills (Figma: MEW Web App — Design Library ›
 * Card, component set 2276:5773).
 */

/**
 * Figma "Variant" — which surface the card sits on, spelled `surface` to match
 * Chip, Picker and Input. `default` fills white for a grey page; `alternative`
 * fills grey for a white one.
 */
export type CardSurface = 'default' | 'alternative'

/**
 * Resting fill per surface, plus hover / pressed. Those two are keyed off the
 * enabled hit button (`.card-hit`), so a non-interactive, disabled or loading
 * card never reacts, and hovering a nested action doesn't light up the card.
 * Hover skips `:active`: Tailwind orders these arbitrary variants by string,
 * which puts the hover rule last, so it would otherwise mask the pressed fill.
 */
export const CARD_SURFACE_BG_CLASS: Record<CardSurface, string> = {
  default:
    'bg-background-alternative has-[>.card-hit:enabled:hover:not(:active)]:bg-background-alternative-hover has-[>.card-hit:enabled:active]:bg-background-alternative-pressed',
  alternative:
    'bg-background-default has-[>.card-hit:enabled:hover:not(:active)]:bg-background-default-hover has-[>.card-hit:enabled:active]:bg-background-default-pressed',
}
