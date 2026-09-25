<script setup lang="ts">
// Shell for the design-library previews. The sidebar lists the components that
// have a preview page; the selected one renders in the main area via
// <router-view>. Add a row here as each component gains a preview. Never
// registered in production builds — see routesDefault.ts.
const COMPONENTS: { name: string; to: string }[] = [
  { name: 'Avatar', to: '/dev/avatar' },
  { name: 'Button', to: '/dev/button' },
  { name: 'Chip', to: '/dev/chip' },
  { name: 'Colors', to: '/dev/colors' },
  { name: 'Content Group', to: '/dev/content-group' },
  { name: 'Icon', to: '/dev/icons' },
  { name: 'Input', to: '/dev/input' },
  { name: 'Picker', to: '/dev/picker' },
  { name: 'Tooltip', to: '/dev/tooltip' },
]
</script>

<template>
  <!-- Fixed to the space below the app header so only the main column scrolls;
       the sidebar stays put. Header is 68px (xs) / 76px (sm+) — see TheHeader. -->
  <div
    class="flex h-[calc(100dvh-68px)] sm:h-[calc(100dvh-76px)] overflow-hidden bg-background-default"
  >
    <aside
      class="w-56 shrink-0 overflow-y-auto border-r border-border-default bg-white p-4"
    >
      <router-link
        to="/dev"
        class="block text-s-16 font-bold text-text-default mb-4 hoverOpacity"
      >
        Design library
      </router-link>
      <p
        class="text-s-11 font-bold uppercase text-text-subtle tracking-sp-06 mb-2"
      >
        Components
      </p>
      <nav class="flex flex-col gap-1">
        <router-link
          v-for="c in COMPONENTS"
          :key="c.to"
          :to="c.to"
          class="rounded-8 px-3 py-2 text-s-14 text-text-default hoverNoBG transition-colors"
          active-class="bg-background-default-hover font-medium"
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
