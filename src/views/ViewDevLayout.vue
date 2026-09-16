<script setup lang="ts">
// DEV-only shell for the design-library previews. The sidebar lists the
// components that have a preview page; the selected one renders in the main
// area via <router-view>. Add a row here as each component gains a preview.
// Never registered in production builds — see routesDefault.ts.
import { ROUTES_DEV } from '@/router/routeNames'

const components = [
  {
    id: 'avatar',
    labelKey: 'dev.avatar.name',
    to: { name: ROUTES_DEV.AVATAR.NAME },
  },
  {
    id: 'chip',
    labelKey: 'dev.chip.name',
    to: { name: ROUTES_DEV.CHIP.NAME },
  },
  {
    id: 'content-group',
    labelKey: 'dev.content_group.name',
    to: { name: ROUTES_DEV.CONTENT_GROUP.NAME },
  },
  {
    id: 'input',
    labelKey: 'dev.input.name',
    to: { name: ROUTES_DEV.INPUT.NAME },
  },
  {
    id: 'picker',
    labelKey: 'dev.picker.name',
    to: { name: ROUTES_DEV.PICKER.NAME },
  },
  {
    id: 'toast',
    labelKey: 'dev.toast.name',
    to: { name: ROUTES_DEV.TOAST.NAME },
  },
  {
    id: 'tooltip',
    labelKey: 'dev.tooltip.name',
    to: { name: ROUTES_DEV.TOOLTIP.NAME },
  },
]
</script>

<template>
  <!-- Fixed to the space below the app header so only the main column scrolls;
       the sidebar stays put. Header is 68px (xs) / 76px (sm+) — see TheHeader. -->
  <div
    class="flex h-[calc(100dvh-68px)] sm:h-[calc(100dvh-76px)] overflow-hidden bg-appBackground"
  >
    <aside
      class="w-56 shrink-0 overflow-y-auto border-r border-grey-10 bg-white p-4"
    >
      <router-link
        :to="{ name: ROUTES_DEV.INDEX.NAME }"
        class="mb-4 block text-s-16 font-bold text-t-default hoverOpacity"
      >
        {{ $t('dev.design_library') }}
      </router-link>
      <p class="mb-2 text-s-11 font-bold uppercase tracking-sp-06 text-info">
        {{ $t('dev.components') }}
      </p>
      <nav class="flex flex-col gap-1">
        <router-link
          v-for="component in components"
          :key="component.id"
          :to="component.to"
          class="rounded-8 px-3 py-2 text-s-14 text-t-default transition-colors hoverNoBG"
          active-class="bg-grey-10 font-medium"
        >
          {{ $t(component.labelKey) }}
        </router-link>
      </nav>
    </aside>
    <main class="min-w-0 flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
