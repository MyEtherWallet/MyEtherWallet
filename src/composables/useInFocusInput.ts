import { ref, onBeforeUnmount, type Ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export const useInFocusInput = (inputEl: Ref<HTMLElement | null>) => {
  /**------------------------
   * Focus State
   -------------------------*/
  const inFocusInput = ref(false)

  /**
   * Destructures the `useTimeoutFn` function to handle the out-of-focus timeout for the input field.
   *
   * @constant {boolean} isPendingOutOfFocusTimeout - Indicates if the timeout is currently pending.
   * @function startOutOfFocusTimeout - Starts the out-of-focus timeout.
   * @function stopOutOfFocusTimeout - Stops the out-of-focus timeout.
   *
   * The timeout function sets `inFocusInput` to false.
   *
   * @param {number} 150 - The duration of the timeout in milliseconds.
   * @param {Object} { immediate: false } - Does not start the timeout immediately.
   */
  const {
    isPending: isPendingOutOfFocusTimeout,
    start: startOutOfFocusTimeout,
    stop: stopOutOfFocusTimeout,
  } = useTimeoutFn(
    () => {
      inFocusInput.value = false
    },
    150,
    { immediate: false },
  )

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
    setInFocusInput,
    startOutOfFocusTimeout,
  }
}
