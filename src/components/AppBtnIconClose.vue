<template>
  <app-btn-icon
    @click="closeClick"
    :is-white="props.isWhite"
    :label="label ?? $t('common.close')"
  >
    <XMarkIcon />
  </app-btn-icon>
</template>
<script setup lang="ts">
import AppBtnIcon from './AppBtnIcon.vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

/**
 * @description A close icon button component.
 * @emits close - When the close button is clicked.
 *
 * @example Simple usage
 * <app-btn-icon-close @close="close" />
 *
 *  @example Custome aria-label
 * <app-btn-icon-close @close="close" label="close dialog" />
 *
 * @example White close icon
 * <app-btn-icon-close @close="close" is-white />
 */

const props = defineProps({
  /**
   * @label Whether the close icon button should be white.
   */
  isWhite: {
    default: false,
    type: Boolean,
  },
  /**
   * @label The aria-label for the close button.
   */
  label: {
    type: String,
  },
})
const emit = defineEmits<{
  close: [payload: MouseEvent]
}>()

/**
 * emits the close event when the close button is clicked.
 * @param payload The mouse event payload.
 */
const closeClick = (payload: MouseEvent) => {
  emit('close', payload)
}
</script>
