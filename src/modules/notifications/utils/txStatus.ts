import type { TagType, TagVariant } from '@/components/tag/types'

type TxStatusKey = 'pending' | 'possibly_dropped' | 'failed' | 'successful'

const TX_STATUS: Record<
  TxStatusKey,
  { labelKey: string; type: TagType; variant: TagVariant }
> = {
  pending: {
    labelKey: 'notifications_module.status.pending',
    type: 'branded',
    variant: 'strong',
  },
  possibly_dropped: {
    labelKey: 'notifications_module.status.possibly_dropped',
    type: 'neutral',
    variant: 'subtle',
  },
  failed: {
    labelKey: 'notifications_module.status.failed',
    type: 'danger',
    variant: 'strong',
  },
  successful: {
    labelKey: 'notifications_module.status.successful',
    type: 'success',
    variant: 'strong',
  },
}

const POSSIBLY_DROPPED_AFTER_SECONDS = 48 * 60 * 60

/**
 * Status tag of a transaction / swap / bridge notification. A `sent` tx older
 * than 48h reads as possibly dropped; anything neither sent nor failed counts
 * as successful.
 */
export const getTxNotificationStatus = (status: string, createdAt: number) => {
  const normalized = status.toLowerCase()
  let key: TxStatusKey = 'successful'
  if (normalized === 'sent') {
    const age = Math.floor(Date.now() / 1000) - createdAt
    key = age > POSSIBLY_DROPPED_AFTER_SECONDS ? 'possibly_dropped' : 'pending'
  } else if (normalized === 'failed') {
    key = 'failed'
  }
  return { key, ...TX_STATUS[key] }
}
