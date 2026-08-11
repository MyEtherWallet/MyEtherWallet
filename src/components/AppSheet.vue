<template>
  <div
    :class="[
      'relative p-6 sm:px-10 lg:px-14  bg-surface rounded-16 w-full ',
      sheetClass,
      { 'shadow-button': isElivated },
    ]"
  >
    <slot v-if="$slots.title || title !== ''" name="title">
      <h1 v-if="title !== ''" :class="['pt-3 pb-1 title5 ', titleClass]">
        {{ title }}
      </h1>
      <slot name="description" />
    </slot>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    default: '',
    type: String,
  },
  sheetClass: {
    default: '',
    type: String,
  },
  titleClass: {
    default: '',
    type: String,
  },
  isElivated: {
    default: true,
    type: Boolean,
  },
})
</script>
