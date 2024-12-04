<template>
  <MewAppBtnIcon
    :icon="ICONClose"
    @click="closeClick"
    :is-white="props.isWhite"
    :aria-label-string="$t('common.close')"
  />
</template>

<script setup lang="ts">
import MewAppBtnIcon from './MewAppBtnIcon.vue'
import ICONClose from '@/assets/icons/close.svg'

const props = defineProps({
  isWhite: {
    default: false,
    type: Boolean,
  },
})
const emit = defineEmits<{
  close: [payload: MouseEvent]
}>()

const closeClick = (payload: MouseEvent) => {
  emit('close', payload)
}
</script>
