<template>
  <button
    type="button"
    :aria-label="label"
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
  /**
   * @isWhite - if the button icon should be white
   */
  isWhite: {
    default: false,
    type: Boolean,
  },
  /**
   * @label - aria label for the button
   */
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  click: [payload: MouseEvent]
}>()

const btnClick = (payload: MouseEvent) => {
  emit('click', payload)
}
</script>
