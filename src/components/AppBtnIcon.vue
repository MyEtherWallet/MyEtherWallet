<template>
  <button
    type="button"
    :aria-label="ariaLabelString"
    :class="[
      'rounded-full hoverNoBG !cursor-pointer p-1 h-[32px] w-[32px]',
      { 'invert brightness-100': isWhite },
    ]"
    @click="btnClick"
  >
    <div>
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps({
  isWhite: {
    default: false,
    type: Boolean,
  },
  ariaLabelString: {
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
