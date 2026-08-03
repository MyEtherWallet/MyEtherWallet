<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; loading?: boolean; empty?: boolean; error?: boolean }>()
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

    <div v-if="loading" data-test="section-skeleton" class="animate-pulse h-40 rounded-lg bg-black/5" />
    <div v-else-if="error" data-test="section-error"><slot name="error" /></div>
    <div v-else-if="empty" data-test="section-empty" class="text-sm opacity-70"><slot name="empty" /></div>
    <slot v-else />
  </section>
</template>
