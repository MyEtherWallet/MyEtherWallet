<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Lists every preview registered under /dev/ (the ViewDevLayout children in
// routesDefault.ts), so a new showcase shows up here without another edit.
const router = useRouter()

const DEV_PREFIX = '/dev/'

const previewRoutes = computed(() =>
  router
    .getRoutes()
    .filter(route => route.path.startsWith(DEV_PREFIX))
    .map(route => ({
      path: route.path,
      label: route.path.slice(DEV_PREFIX.length).replace(/-/g, ' '),
    }))
    .sort((a, b) => a.label.localeCompare(b.label)),
)
</script>

<template>
  <div class="p-8 max-w-3xl">
    <h1 class="text-s-24 font-bold text-t-default mb-2">
      Design library — dev previews
    </h1>
    <p class="mb-8 text-s-14 text-info">
      Every component preview registered under <code>/dev/</code>. Pick one here
      or from the sidebar to preview it against Figma.
    </p>

    <ul class="flex max-w-[480px] flex-col gap-2">
      <li v-for="route in previewRoutes" :key="route.path">
        <RouterLink
          :to="route.path"
          class="flex items-center justify-between rounded-12 bg-white px-4 py-3 transition-colors hover:bg-bgSurface-hover"
        >
          <span
            class="text-s-16 font-semibold capitalize leading-[22px] tracking-[-0.32px] text-black"
          >
            {{ route.label }}
          </span>
          <span class="text-s-14 leading-5 text-t-subtle">{{
            route.path
          }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
