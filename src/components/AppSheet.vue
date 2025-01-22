<template>
  <div
    :class="[
      'p-6 sm:px-10 lg:px-14 min-h-[500px] bg-white rounded-4xl w-full',
      sheetClass,
    ]"
  >
    <div>
      <h1 v-if="title !== ''" :class="['pt-3 pb-1 title5 ', titleClass]">
        {{ title }}
      </h1>
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
  description: {
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
