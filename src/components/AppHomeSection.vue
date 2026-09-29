<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <section class="relative px-3 pb-8 pt-3 xs:px-5 xs:pt-6">
    <header v-if="title" class="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 data-test="section-title" class="text-heading-base text-black">
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="mt-2 text-s-16 leading-[22px] text-text-subtle"
        >
          {{ subtitle }}
        </p>
      </div>
      <slot name="action" />
    </header>

    <slot />
  </section>
</template>
