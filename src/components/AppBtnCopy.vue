<template>
  <app-btn-icon
    @click="copyClick"
    :is-white="props.isWhite"
    :label="label ?? $t('common.copy')"
  >
    <ClipboardDocumentIcon class="w-5 h-5" />
  </app-btn-icon>
</template>
<script setup lang="ts">
import AppBtnIcon from './AppBtnIcon.vue'
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
/**
 * @description A button that copies the copyValue to the clipboard.
 * @emits copy - When the copy button is clicked.
 *
 * @example Copy button with white icon
 * <app-btn-copy isWhite copyValue="0x1234" label="Copy Important value: 1234" />
 *
 * @example Copy button with default icon and default label
 * <app-btn-copy copyValue="0x1234"  />
 *
 */
const props = defineProps({
  /**
   * @label Whether the copy icon button should be white.
   */
  isWhite: {
    default: false,
    type: Boolean,
  },
  /**
   * @label The aria-label for the copy button.
   */
  label: {
    type: String,
  },
  /**
   * @copyValue The value to copy to the clipboard.
   */
  copyValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  copy: [payload: MouseEvent]
}>()

/**
 * Copies the copyValue to the clipboard.
 */
const copy = () => {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(props.copyValue).then(resolve).catch(reject)
  })
}
/**
 * emits the close event when the close button is clicked.
 * @param payload The mouse event payload.
 */
const copyClick = (payload: MouseEvent) => {
  copy()
  //TODO: add show toast event
  emit('copy', payload)
}
</script>
