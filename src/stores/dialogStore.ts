import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDialogStore = defineStore('dialogStore', () => {
  /**
   * Number of dialogs currently open. The app root reads `isAreaHidden` to set
   * `inert`/`aria-hidden` behind any open dialog.
   *
   * Refcounted rather than a boolean: several always-mounted dialogs share this
   * flag, and with a boolean the pre-flush watcher of whichever dialog happened
   * to run last won — on a transition between two modals (e.g. the trade flow's
   * processing → review) the closing dialog's `false` could land after the
   * opening dialog's `true`, leaving the background tabbable behind a modal.
   */
  const openDialogCount = ref(0)

  const isAreaHidden = computed(() => openDialogCount.value > 0)

  /** A dialog opened. Call exactly once per open (AppDialog owns this). */
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
