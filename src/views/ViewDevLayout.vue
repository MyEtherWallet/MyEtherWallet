<script setup lang="ts">
// DEV-only shell for the design-library previews (MEW-2271). The sidebar lists
// the components that have a preview page; the selected one renders in the main
// area via <router-view>. Add a row here as each component gains a preview.
// Never registered in production builds — see routesDefault.ts.
const COMPONENTS: { name: string; to: string }[] = [
  { name: 'Content Group', to: '/dev/content-group' },
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
        to="/dev"
        class="block text-s-16 font-bold text-t-default mb-4 hoverOpacity"
      >
        Design library
      </router-link>
      <p class="text-s-11 font-bold uppercase text-info tracking-sp-06 mb-2">
        Components
      </p>
      <nav class="flex flex-col gap-1">
        <router-link
          v-for="c in COMPONENTS"
          :key="c.to"
          :to="c.to"
          class="rounded-8 px-3 py-2 text-s-14 text-t-default hoverNoBG transition-colors"
          active-class="bg-grey-10 font-medium"
        >
          {{ c.name }}
        </router-link>
      </nav>
    </aside>
    <main class="flex-1 min-w-0 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
