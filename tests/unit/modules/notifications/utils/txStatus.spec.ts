import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTxNotificationStatus } from '@/modules/notifications/utils/txStatus'

const NOW = 1_700_000_000
const HOUR = 60 * 60

describe('getTxNotificationStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW * 1000)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('maps a recent sent tx to a branded strong pending tag', () => {
    expect(getTxNotificationStatus('SENT', NOW - HOUR)).toEqual({
      key: 'pending',
      labelKey: 'notifications_module.status.pending',
      type: 'branded',
      variant: 'strong',
    })
  })

  it('maps a sent tx older than 48h to a neutral subtle possibly-dropped tag', () => {
    expect(getTxNotificationStatus('sent', NOW - 49 * HOUR)).toMatchObject({
      key: 'possibly_dropped',
      type: 'neutral',
      variant: 'subtle',
    })
  })

  it('maps failed to danger strong', () => {
    expect(getTxNotificationStatus('Failed', NOW)).toMatchObject({
      key: 'failed',
      type: 'danger',
      variant: 'strong',
    })
  })

  it('treats any other status as successful', () => {
    expect(getTxNotificationStatus('confirmed', NOW)).toMatchObject({
      key: 'successful',
      type: 'success',
      variant: 'strong',
    })
  })
})
