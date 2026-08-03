<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description?: string
  icon?: string
  image?: string
  to?: string
}>()

const tag = computed(() => (props.to ? 'RouterLink' : 'div'))
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    data-test="rewards-card"
    class="block rounded-2xl p-6 transition hover:shadow-md"
  >
    <img v-if="image" :src="image" alt="" class="mb-4 h-10 w-10" />
    <h3 data-test="rewards-title" class="font-semibold">{{ title }}</h3>
    <p
      v-if="description"
      data-test="rewards-desc"
      class="mt-1 text-sm opacity-70"
    >
      {{ description }}
    </p>
  </component>
</template>
