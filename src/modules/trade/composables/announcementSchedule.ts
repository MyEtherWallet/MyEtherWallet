/** Delay between the announcement modal and the follow-up tooltip. */
export const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000

/**
 * Whether the follow-up Trade tooltip is due.
 * @param modalShownAt epoch ms when the modal was first shown; `<= 0` = never.
 */
export function isTooltipDue(
  modalSeen: boolean,
  tooltipSeen: boolean,
  modalShownAt: number,
  now: number,
): boolean {
  if (!modalSeen || tooltipSeen || modalShownAt <= 0) return false
  return now - modalShownAt >= FIVE_DAYS_MS
}
