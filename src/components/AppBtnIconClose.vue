<template>
  <AppBtnIcon
    @click="closeClick"
    :is-white="props.isWhite"
    :aria-label-string="ariaLabelString ?? $t('common.close')"
  >
    <XMarkIcon />
  </AppBtnIcon>
</template>

<script setup lang="ts">
import AppBtnIcon from './AppBtnIcon.vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  isWhite: {
    default: false,
    type: Boolean,
  },
  ariaLabelString: {
    type: String,
  },
})
const emit = defineEmits<{
  close: [payload: MouseEvent]
}>()

const closeClick = (payload: MouseEvent) => {
  emit('close', payload)
}
</script>
