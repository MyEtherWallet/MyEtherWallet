<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    target="_blank"
    :aria-label="label"
    :class="[
      'rounded-full !cursor-pointer p-1 flex items-center justify-center transition-colors duration-300',
      { 'invert brightness-100': isWhite },
      disabled
        ? 'text-text-placeholder'
        : filled
          ? 'bg-background-default hover:bg-background-default-hover'
          : 'hoverNoBG',
      height,
      width,
    ]"
    @click="btnClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
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
  /**
   * @filled - solid grey background (grey-5, darker on hover) instead of the
   * default transparent hoverNoBG treatment.
   */
  filled: {
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
  if (!props.disabled) emit('click', payload)
}
</script>
