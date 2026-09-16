<script setup lang="ts">
import { ROUTES_DEV } from '@/router/routeNames'

const components = [
  {
    id: 'toast',
    labelKey: 'dev.toast.name',
    to: { name: ROUTES_DEV.TOAST.NAME },
  },
]
</script>

<template>
  <div class="flex min-h-screen bg-appBackground">
    <aside class="w-56 shrink-0 border-r border-grey-10 bg-white p-4">
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
    <main class="min-w-0 flex-1 overflow-x-auto">
      <router-view />
    </main>
  </div>
</template>
