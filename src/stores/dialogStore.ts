import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useScrollLock } from '@vueuse/core'

export const useDialogStore = defineStore('dialogStore', () => {
  /**
   * Number of dialogs currently open. The app root reads `isAreaHidden` to set
   * `inert`/`aria-hidden` behind any open dialog, and the body scroll lock
   * below follows it, so stacked modals keep both until the last one closes.
   *
   * Refcounted rather than a boolean: several always-mounted dialogs share this
   * flag, and with a boolean the pre-flush watcher of whichever dialog happened
   * to run last won — on a transition between two modals (e.g. the trade flow's
   * processing → review) the closing dialog's `false` could land after the
   * opening dialog's `true`, leaving the background tabbable behind a modal.
   */
  const openDialogCount = ref(0)

  const isAreaHidden = computed(() => openDialogCount.value > 0)

  const bodyScrollLocked = useScrollLock(
    typeof document === 'undefined' ? null : document.body,
  )
  watch(isAreaHidden, hidden => {
    bodyScrollLocked.value = hidden
  })

  /** A dialog opened. Call exactly once per open (AppModal owns this). */
  const pushAreaHidden = () => {
    openDialogCount.value += 1
  }

  /** A dialog closed or unmounted while open. Paired with pushAreaHidden. */
  const popAreaHidden = () => {
    openDialogCount.value = Math.max(0, openDialogCount.value - 1)
  }

  return {
    isAreaHidden,
    pushAreaHidden,
    popAreaHidden,
  }
})
