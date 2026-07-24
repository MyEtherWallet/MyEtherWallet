/**
 * ---------------------------------
 * Date Format Helper.
 * Used to format notification timestamps in the UI
 * ---------------------------------
 */

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Format a notification timestamp as a relative time.
 *
 * - < 1 minute:  "Just now"
 * - < 1 hour:    "X minute(s) ago"
 * - < 24 hours:  "X hour(s) ago"
 * - < 3 days:    "X day(s) ago"
 * - >= 3 days:   full date (e.g. "Jul 6, 2026, 2:30 PM")
 *
 * @param timestamp Unix timestamp in seconds
 */
export const formatNotificationDate = (timestamp: number): string => {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const diff = Math.max(0, nowSeconds - timestamp)

  if (diff < MINUTE) {
    return 'Just now'
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  if (diff < 3 * DAY) {
    const days = Math.floor(diff / DAY)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  return new Date(timestamp * 1000).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
