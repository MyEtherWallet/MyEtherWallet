import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Toast } from '@/types/notification/index'

/**
 * Toast store
 * Toast will be deleted after 6 seconds by default. If you want to keep it infinite, set isInfinite to true
 * By Default toast Message is of Type Info.
 * Original Toast Module is imported in the App.vue file
 *
 * @returns { messages, addToastMessage, removeToastMessage }
 *
 * @messages {Toast[]} - Array of Toast Messages
 * @addToastMessage {Function} - Add a new toast message
 * @removeToastMessage {Function} - Remove a toast message
 *
 *
 * @example usage in codebase
 *
 * import { useToastStore } from '@/stores/toastStore'
 * const toastStore = useToastStore()
 *
 * // with isInfinite option
 * toastStore.addToastMessage({
 *   text: 'This is a toast message',
 *   isInfinite: true,
 * })
 *
 * // with secondary text and a link, rendered as the toast's button (only the
 * // success, warning, error and transaction-completed types show it)
 * toastStore.addToastMessage({
 *   type: ToastType.Success,
 *   text: 'This is a toast title',
 *   textSecondary: 'This is a secondary text',
 *   link: {
 *     title: 'Click here',
 *     url: 'https://www.google.com',
 *   },
 * })
 *
 *
 *
 * // with duration and toast type
 * toastStore.addToastMessage({
 *   text: 'This is a toast message',
 *   duration: 3000,
 *   type: ToastType.Success,
 * })
 */

export const useToastStore = defineStore('toastStore', () => {
  const messages = ref<Toast[]>([])
  let nextToastId = 0
  // Every toast gets an id so the host can key and remove it reliably. Re-adding
  // an id that is already showing replaces that toast in place.
  const addToastMessage = (message: Toast) => {
    const toast = { ...message, id: message.id ?? `toast-${++nextToastId}` }
    const existingIndex = messages.value.findIndex(({ id }) => id === toast.id)
    if (existingIndex >= 0) messages.value.splice(existingIndex, 1, toast)
    else messages.value.push(toast)
  }
  const removeToastMessage = (index: number) => {
    messages.value.splice(index, 1)
  }
  const removeToastById = (id: string) => {
    const index = messages.value.findIndex(message => message.id === id)
    if (index >= 0) messages.value.splice(index, 1)
  }

  return {
    messages,
    addToastMessage,
    removeToastMessage,
    removeToastById,
  }
})
