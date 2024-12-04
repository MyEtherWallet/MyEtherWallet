<template>
  <button
    type="button"
    :aria-label="ariaLabelString"
    :class="[
      'rounded-full hoverBGGrey !cursor-pointer',
      height,
      width,
      { 'invert brightness-100': isWhite },
    ]"
    @click="btnClick"
  >
    <img
      :src="icon"
      contain
      alt=""
      class="m-auto"
      :width="iconWidth"
      :height="iconHeight"
      loading="lazy"
    />
  </button>
</template>

<script setup lang="ts">
import ICONClose from '@/assets/icons/close.svg'

defineProps({
  icon: {
    default: ICONClose,
    type: String,
  },
  height: {
    default: 'h-[32px]',
    type: String,
  },
  width: {
    default: 'w-[32px]',
    type: String,
  },
  isWhite: {
    default: false,
    type: Boolean,
  },
  ariaLabelString: {
    type: String,
  },
  iconWidth: {
    default: '32px',
    type: String,
  },
  iconHeight: {
    default: '32px',
    type: String,
  },
})

const emit = defineEmits<{
  click: [payload: MouseEvent]
}>()

const btnClick = (payload: MouseEvent) => {
  emit('click', payload)
}
</script>
