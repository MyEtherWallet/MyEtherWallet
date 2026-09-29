<template>
  <app-btn-icon
    @click="closeClick"
    icon="x-mark"
    icon-variant="filled"
    :label="label ?? $t('common.close')"
  />
</template>
<script setup lang="ts">
import AppBtnIcon from './AppBtnIcon.vue'

/**
 * @description A close icon button component. Other AppBtnIcon props
 * (`variant`, `size`) fall through to the button.
 * @emits close - When the close button is clicked.
 *
 * @example Simple usage
 * <app-btn-icon-close @close="close" />
 *
 *  @example Custome aria-label
 * <app-btn-icon-close @close="close" label="close dialog" />
 *
 * @example On a dark surface
 * <app-btn-icon-close @close="close" variant="naked-contrast" />
 */

defineProps({
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
