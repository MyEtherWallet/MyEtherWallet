<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppCell from '@/components/AppCell.vue'

// Lists every preview registered under /dev/ (the ViewDevLayout children in
// routesDefault.ts), so a new showcase shows up here without another edit.
// Each row is a design-library Cell, so the index doubles as a live sample.
const router = useRouter()

const DEV_PREFIX = '/dev/'

const toLabel = (path: string): string => {
  const slug = path.slice(DEV_PREFIX.length).replace(/-/g, ' ')
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

const previewRoutes = computed(() =>
  router
    .getRoutes()
    .filter(route => route.path.startsWith(DEV_PREFIX))
    .map(route => ({ path: route.path, label: toLabel(route.path) }))
    .sort((a, b) => a.label.localeCompare(b.label)),
)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-8 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Design library — dev previews</h1>
      <p class="text-text-sm text-text-subtle">
        Every component preview registered under /dev/. Pick one here or from
        the sidebar to preview it against Figma.
      </p>
    </header>

    <ul class="flex max-w-[480px] flex-col gap-1">
      <li v-for="route in previewRoutes" :key="route.path">
        <AppCell
          size="small"
          :title="route.label"
          :description="route.path"
          @click="router.push(route.path)"
        />
      </li>
    </ul>
  </div>
</template>
