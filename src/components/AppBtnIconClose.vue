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

const props = defineProps({
  isWhite: {
    default: false,
    type: Boolean,
  },
  label: {
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
