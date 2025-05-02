<template>
  <div
    :class="[
      'p-6 sm:px-10 lg:px-14 min-h-[500px] bg-white rounded-32 w-full',
      sheetClass,
    ]"
  >
    <div>
      <h1 v-if="title !== ''" :class="['pt-3 pb-1 title5 ', titleClass]">
        {{ title }}
      </h1>
      <slot name="description" />
    </div>
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
})
</script>
