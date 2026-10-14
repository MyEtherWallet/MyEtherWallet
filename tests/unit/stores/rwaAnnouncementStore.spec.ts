import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRwaAnnouncementStore } from '@/stores/rwaAnnouncementStore'

describe('rwaAnnouncementStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('followupUnlocked — gates the weekend-trading tooltip', () => {
    it('is false for a user who has not reached the campaign yet', () => {
      const store = useRwaAnnouncementStore()
      expect(store.followupUnlocked).toBe(false)
    })

    // `markModalSeen` fires when the announcement OPENS, so it must not unlock
    // anything — otherwise the tooltip would fire over the open announcement.
    it('stays false while the announcement is open', () => {
      const store = useRwaAnnouncementStore()
      store.markModalSeen()
      expect(store.modalSeen).toBe(true)
      expect(store.followupUnlocked).toBe(false)
    })

    it('flips to true when the announcement closes, with no waiting period', () => {
      vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
      const store = useRwaAnnouncementStore()
      store.markModalSeen()
      store.markModalClosed()
      expect(store.followupUnlocked).toBe(true)
    })

    it('is true on load for a user who saw the campaign in an earlier session', () => {
      localStorage.setItem('mew-rwa-announcement-seen', 'true')
      const store = useRwaAnnouncementStore()
      expect(store.modalClosedAt).toBe(0)
      expect(store.followupUnlocked).toBe(true)
    })

    it('is true on load for a user who closed the announcement earlier', () => {
      localStorage.setItem('mew-rwa-announcement-closed-at', '1700000000000')
      const store = useRwaAnnouncementStore()
      expect(store.followupUnlocked).toBe(true)
    })
  })

  describe('isTradeInfoOpen — holds the tooltip off, does not gate it', () => {
    it('defaults to closed and is not persisted', () => {
      localStorage.setItem('mew-rwa-announcement-closed-at', '1700000000000')
      const store = useRwaAnnouncementStore()
      expect(store.isTradeInfoOpen).toBe(false)
    })

    it('tracks the modal without touching the unlock', () => {
      vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
      const store = useRwaAnnouncementStore()
      store.markModalClosed()

      store.setTradeInfoOpen(true)
      expect(store.isTradeInfoOpen).toBe(true)
      expect(store.followupUnlocked).toBe(true)

      store.setTradeInfoOpen(false)
      expect(store.isTradeInfoOpen).toBe(false)
      expect(store.followupUnlocked).toBe(true)
    })
  })

  it('markModalClosed keeps the first close timestamp', () => {
    const store = useRwaAnnouncementStore()
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(9999)
    store.markModalClosed()
    store.markModalClosed()
    expect(store.modalClosedAt).toBe(1000)
  })

  // The 24/7 modal's gate, which keeps its 3-day wait.
  it('followupCooldownElapsed still requires 3 days after the close', () => {
    const closedAt = 1_700_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(closedAt)
    const store = useRwaAnnouncementStore()
    store.markModalClosed()
    expect(store.followupUnlocked).toBe(true)
    expect(store.followupCooldownElapsed).toBe(false)
  })
})
