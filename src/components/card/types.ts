/**
 * Card design-library types + fills (Figma: MEW Web App — Design Library ›
 * Card, component set 2276:5773).
 */
export type CardVariant = 'default' | 'alternative'

/**
 * Resting fill per variant, plus hover / pressed. Those two are keyed off the
 * enabled hit button (`.card-hit`), so a non-interactive, disabled or loading
 * card never reacts, and hovering a nested action doesn't light up the card.
 */
export const CARD_VARIANT_CLASS: Record<CardVariant, string> = {
  default:
    'bg-background-alternative has-[>.card-hit:enabled:hover]:bg-background-alternative-hover has-[>.card-hit:enabled:active]:bg-background-alternative-pressed',
  alternative:
    'bg-background-default has-[>.card-hit:enabled:hover]:bg-background-default-hover has-[>.card-hit:enabled:active]:bg-background-default-pressed',
}
