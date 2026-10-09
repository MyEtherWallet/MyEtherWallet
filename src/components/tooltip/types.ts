/**
 * Tooltip design-library types + geometry (Figma: MEW Web App — Design Library ›
 * Tooltip, node 2279-37377). Centralized so AppTooltip reads one source.
 *
 * `placement` is the side the tooltip sits on relative to the trigger; the arrow
 * points back at the trigger. (Figma names its variants by the arrow side, which
 * is the opposite — this follows the ticket's `placement` semantics.)
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
export type TooltipTrigger = 'hover' | 'focus' | 'click'

/** The tooltip is a flex assembly of bubble + arrow; top/bottom stack, left/right sit side by side. */
export const PLACEMENT_FLEX: Record<TooltipPlacement, string> = {
  top: 'flex-col',
  bottom: 'flex-col',
  left: 'flex-row',
  right: 'flex-row',
}

/** Render the arrow before the bubble when the tooltip sits below/right of the trigger. */
export const ARROW_BEFORE: Record<TooltipPlacement, boolean> = {
  top: false,
  bottom: true,
  left: false,
  right: true,
}

/**
 * Rotation to face the trigger. The arrow is drawn with an orientation-matched
 * box (see AppTooltip): the vertical arrow points down and the horizontal one
 * points right by default, so only the away-facing sides flip 180°.
 */
export const ARROW_ROTATE: Record<TooltipPlacement, string> = {
  top: '',
  bottom: 'rotate-180',
  left: '',
  right: 'rotate-180',
}

export const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}
