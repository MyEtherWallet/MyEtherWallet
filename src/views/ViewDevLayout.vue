<script setup lang="ts">
import { ROUTES_DEV } from '@/router/routeNames'

const components = [{ name: 'Toggle', to: { name: ROUTES_DEV.TOGGLE.NAME } }]
</script>

<template>
  <div class="flex min-h-screen bg-appBackground">
    <aside class="w-56 shrink-0 border-r border-grey-10 bg-white p-4">
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
    <main class="min-w-0 flex-1 overflow-x-auto">
      <router-view />
    </main>
  </div>
</template>
