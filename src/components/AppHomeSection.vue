<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="px-8 py-8">
    <header class="mb-6 flex items-start justify-between">
      <div>
        <h2 data-test="section-title" class="text-lg font-semibold">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm opacity-70">{{ subtitle }}</p>
      </div>
      <slot name="action" />
    </header>

    <slot />
  </section>
</template>
