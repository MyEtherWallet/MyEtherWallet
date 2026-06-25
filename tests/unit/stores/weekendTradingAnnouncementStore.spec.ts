// tests/unit/stores/weekendTradingAnnouncementStore.spec.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWeekendTradingAnnouncementStore } from '@/stores/weekendTradingAnnouncementStore'
import { FIVE_DAYS_MS } from '@/modules/trade/composables/announcementSchedule'

describe('weekendTradingAnnouncementStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('markModalSeen sets the seen flag and a positive timestamp', () => {
    const now = 1_700_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const store = useWeekendTradingAnnouncementStore()
    expect(store.modalSeen).toBe(false)
    store.markModalSeen()
    expect(store.modalSeen).toBe(true)
    expect(store.modalShownAt).toBe(now)
  })

  it('markModalSeen does not overwrite an existing timestamp', () => {
    const store = useWeekendTradingAnnouncementStore()
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(9999)
    store.markModalSeen()
    store.markModalSeen()
    expect(store.modalShownAt).toBe(1000)
  })

  it('shouldShowTooltip is false right after the modal is shown', () => {
    const now = 1_700_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const store = useWeekendTradingAnnouncementStore()
    store.markModalSeen()
    expect(store.shouldShowTooltip).toBe(false)
  })

  it('shouldShowTooltip is true 5+ days after the modal was shown', () => {
    const shownAt = 1_700_000_000_000
    const store = useWeekendTradingAnnouncementStore()
    vi.spyOn(Date, 'now').mockReturnValue(shownAt)
    store.markModalSeen()
    vi.spyOn(Date, 'now').mockReturnValue(shownAt + FIVE_DAYS_MS)
    expect(store.shouldShowTooltip).toBe(true)
  })

  it('markTooltipSeen turns shouldShowTooltip back to false', () => {
    const shownAt = 1_700_000_000_000
    const store = useWeekendTradingAnnouncementStore()
    vi.spyOn(Date, 'now').mockReturnValue(shownAt)
    store.markModalSeen()
    vi.spyOn(Date, 'now').mockReturnValue(shownAt + FIVE_DAYS_MS)
    store.markTooltipSeen()
    expect(store.shouldShowTooltip).toBe(false)
  })
})
