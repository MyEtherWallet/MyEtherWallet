import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

// Follow-up announcements (the 24/7 weekend-trading modal + tooltip) are
// sequenced behind this one: they never surface while it is open and only
// after 3 days have elapsed since it was first closed.
const FOLLOWUP_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000

export const useRwaAnnouncementStore = defineStore('rwaAnnouncement', () => {
  const modalSeen = useLocalStorage<boolean>('mew-rwa-announcement-seen', false)
  // epoch ms when the modal was first closed; 0 = never closed.
  const modalClosedAt = useLocalStorage<number>(
    'mew-rwa-announcement-closed-at',
    0,
  )

  // Snapshot taken during store setup, which runs before `RwaAnnouncementDialog`
  // can open the modal (it does that in `onMounted`, after two awaits). So a
  // `modalSeen` already true here can only come from an earlier session — the
  // live ref is no use for this, since it flips the moment the modal OPENS.
  const seenInEarlierSession = modalSeen.value

  const markModalSeen = () => {
    modalSeen.value = true
  }
  const markModalClosed = () => {
    if (modalClosedAt.value <= 0) modalClosedAt.value = Date.now()
  }

  /**
   * Whether the Trade & Hold info modal (`RwaTradeInfoModal`) is on screen.
   * Transient by design: it only suppresses followups while the modal is up, and
   * a reload with it open should not keep the tooltip locked out.
   */
  const isTradeInfoOpen = ref(false)
  const setTradeInfoOpen = (open: boolean) => {
    isTradeInfoOpen.value = open
  }

  // True once the modal has been closed AND 3 days have elapsed since. False
  // while the modal is still open (modalClosedAt === 0) or within the cooldown.
  const followupCooldownElapsed = computed(
    () =>
      modalClosedAt.value > 0 &&
      Date.now() - modalClosedAt.value >= FOLLOWUP_COOLDOWN_MS,
  )

  /**
   * True once the Trade & Hold campaign is behind the user, with no waiting
   * period. Two ways to get here:
   *
   * - the announcement was closed at some point (`modalClosedAt`), or
   * - the campaign was already seen in an earlier session.
   *
   * This is the *unlock*, not the whole story: the tooltip additionally holds off
   * while a campaign modal is still on screen, which is what makes the "Go to
   * offer" path wait for that modal instead of firing behind it. Keeping the two
   * concerns apart is deliberate — the unlock is persistent, the hold-off is not.
   *
   * The 24/7 modal is the other followup and still uses the 3-day cooldown.
   */
  const followupUnlocked = computed(
    () => modalClosedAt.value > 0 || seenInEarlierSession,
  )

  return {
    modalSeen,
    modalClosedAt,
    isTradeInfoOpen,
    followupUnlocked,
    followupCooldownElapsed,
    markModalSeen,
    markModalClosed,
    setTradeInfoOpen,
  }
})
