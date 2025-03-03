<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    target="_blank"
    :aria-label="label"
    :class="[
      'rounded-full !cursor-pointer p-1 h-[32px] w-[32px] flex items-center justify-center',
      { 'invert brightness-100': isWhite },
      disabled ? 'text-grey-30' : 'hoverNoBG',
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
})

const emit = defineEmits<{
  click: [payload: MouseEvent]
}>()

const btnClick = (payload: MouseEvent) => {
  emit('click', payload)
}
</script>
