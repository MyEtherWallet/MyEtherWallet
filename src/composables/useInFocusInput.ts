import { ref, onBeforeUnmount, type Ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export const useInFocusInput = (inputEl: Ref<HTMLElement | null>) => {
  /**------------------------
   * Focus State
   -------------------------*/
  const inFocusInput = ref(false)
  /**
   * Figma "Active" state: the user is editing (pointer focus or typing), so the
   * field shows only the caret. Keyboard focus before any edit is "Focus" and
   * keeps the ring. Resets when the field loses focus.
   */
  const isActive = ref(false)
  const setActive = () => {
    isActive.value = true
  }

  /**
   * Destructures the `useTimeoutFn` function to handle the out-of-focus timeout for the input field.
   *
   * @constant {boolean} isPendingOutOfFocusTimeout - Indicates if the timeout is currently pending.
   * @function startOutOfFocusTimeout - Starts the out-of-focus timeout.
   * @function stopOutOfFocusTimeout - Stops the out-of-focus timeout.
   *
   * The timeout function sets `inFocusInput` (and `isActive`) to false.
   *
   * @param {number} 150 - The duration of the timeout in milliseconds.
   * @param {Object} { immediate: false } - Does not start the timeout immediately.
   */
  const {
    isPending: isPendingOutOfFocusTimeout,
    start: startOutOfFocusTimer,
    stop: stopOutOfFocusTimeout,
  } = useTimeoutFn(
    () => {
      inFocusInput.value = false
      isActive.value = false
    },
    150,
    { immediate: false },
  )

  /**
   * Called on blur. Active ends right away, so a quick Tab back (inside the
   * 150ms grace window) is keyboard Focus again; the focus flag itself waits
   * out the timeout so trailing-button clicks don't flicker the field.
   */
  const startOutOfFocusTimeout = () => {
    isActive.value = false
    startOutOfFocusTimer()
  }

  /**
   * Sets the input field to be in focus.
   * If there is a pending out-of-focus timeout, it stops the timeout.
   * Sets the `inFocusInput` to true and focuses the `baseInput`.
   *
   * This function should be called when the input field needs to be focused.
   */
  const setInFocusInput = () => {
    if (isPendingOutOfFocusTimeout.value) {
      stopOutOfFocusTimeout()
    }
    inFocusInput.value = true
    inputEl.value?.focus()
  }

  /* The `onBeforeUnmount` lifecycle hook ensures that the out-of-focus timeout
   * is stopped when the component is about to be unmounted.
   */
  onBeforeUnmount(() => {
    stopOutOfFocusTimeout()
  })
  return {
    inFocusInput,
    isActive,
    setActive,
    setInFocusInput,
    startOutOfFocusTimeout,
  }
}
