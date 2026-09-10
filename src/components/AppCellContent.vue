<template>
  <div class="flex min-w-0 flex-col">
    <p
      class="truncate text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
    >
      <slot name="title">{{ title }}</slot>
    </p>
    <p v-if="description" class="truncate text-s-14 leading-5 text-t-subtle">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
