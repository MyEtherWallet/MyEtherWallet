import { describe, it, expect } from 'vitest'
import {
  isTooltipDue,
  FIVE_DAYS_MS,
} from '@/modules/trade/common/announcementSchedule'

const BASE = 1_700_000_000_000

describe('isTooltipDue', () => {
  it('is false before 5 days elapse', () => {
    expect(isTooltipDue(true, false, BASE, BASE + FIVE_DAYS_MS - 1)).toBe(false)
  })
  it('is true at exactly 5 days', () => {
    expect(isTooltipDue(true, false, BASE, BASE + FIVE_DAYS_MS)).toBe(true)
  })
  it('is true after 5 days', () => {
    expect(isTooltipDue(true, false, BASE, BASE + FIVE_DAYS_MS + 999)).toBe(true)
  })
  it('is false when the tooltip was already seen', () => {
    expect(isTooltipDue(true, true, BASE, BASE + FIVE_DAYS_MS * 2)).toBe(false)
  })
  it('is false when the modal was never seen', () => {
    expect(isTooltipDue(false, false, BASE, BASE + FIVE_DAYS_MS * 2)).toBe(false)
  })
  it('is false when modalShownAt is unset (0)', () => {
    expect(isTooltipDue(true, false, 0, BASE + FIVE_DAYS_MS * 2)).toBe(false)
  })
})
