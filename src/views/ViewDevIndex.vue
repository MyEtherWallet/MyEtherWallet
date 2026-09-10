<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

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
  <div class="min-h-screen bg-appBackground p-10">
    <h1 class="title5 mb-2">Design system playground</h1>
    <p class="mb-8 text-s-14 text-t-subtle">
      Every component preview registered under <code>/dev/</code>. Add a route
      with that prefix and it shows up here.
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
