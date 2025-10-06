<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    target="_blank"
    :aria-label="label"
    :class="[
      'rounded-full !cursor-pointer p-1 flex items-center justify-center ',
      { 'invert brightness-100': isWhite },
      disabled ? 'text-grey-30' : 'hoverNoBG',
      height,
      width,
    ]"
    @click="btnClick"
  >
    <slot />
  </component>
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
  href: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: 'h-[32px]',
  },
  width: {
    type: String,
    default: 'w-[32px]',
  },
})

const emit = defineEmits<{
  click: [payload: MouseEvent]
}>()

const btnClick = (payload: MouseEvent) => {
  emit('click', payload)
}
</script>
