<script setup lang="ts">
import { ROUTES_DEV } from '@/router/routeNames'

// DEV-only shell for the design-library previews (MEW-2271). The sidebar lists
// the components that have a preview page; the selected one renders in the main
// area via <router-view>. Add a row here as each component gains a preview.
// Never registered in production builds — see routesDefault.ts.
const components = [
  { name: 'Toggle', to: { name: ROUTES_DEV.TOGGLE.NAME } },
  { name: 'Content Group', to: { name: ROUTES_DEV.CONTENT_GROUP.NAME } },
]
</script>

<template>
  <!-- Fixed to the space below the app header so only the main column scrolls;
       the sidebar stays put. Header is 68px (xs) / 76px (sm+) — see TheHeader. -->
  <div
    class="flex h-[calc(100dvh-68px)] sm:h-[calc(100dvh-76px)] overflow-hidden bg-app-background"
  >
    <aside
      class="w-56 shrink-0 overflow-y-auto border-r border-grey-10 bg-white p-4"
    >
      <router-link
        :to="{ name: ROUTES_DEV.INDEX.NAME }"
        class="mb-4 block text-s-16 font-bold text-t-default hoverOpacity"
      >
        Design library
      </router-link>
      <p class="mb-2 text-s-11 font-bold uppercase tracking-sp-06 text-info">
        Components
      </p>
      <nav class="flex flex-col gap-1">
        <router-link
          v-for="component in components"
          :key="component.name"
          :to="component.to"
          class="rounded-8 px-3 py-2 text-s-14 text-t-default hoverNoBG transition-colors"
          active-class="bg-grey-10 font-medium"
        >
          {{ component.name }}
        </router-link>
      </nav>
    </aside>
    <main class="min-w-0 flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
