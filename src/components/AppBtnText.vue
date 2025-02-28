<template>
  <button
    :class="[
      ' rounded-full py-1  px-3  text-black transition-[background] duration-300 hoverNoBG',
      { '!text-info': disabled },
    ]"
    :disabled="disabled"
    @click="onClick"
    v-ripple
    :aria-disabled="disabled"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
/**
 * Simple button Text Component
 *
 * @emits click
 * @prop disabled - Whether the button is disabled.
 *
 * @example
 * <app-btn-text @click="onClick" :disabled="true">Click Me</app-btn-text>
 */
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['click'])
const onClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>
