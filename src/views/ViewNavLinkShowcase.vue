<script setup lang="ts">
// Preview for the NavLink design-library component (MEW-2461) at /dev/navlink.
// Matches Figma component set 575:3434 (Status × Show dropdown), on the white
// surface the Navbar sits on.
import { ref } from 'vue'
import AppNavLink from '@/components/navbar/AppNavLink.vue'

const STATUSES = [
  { label: 'Default', selected: false },
  { label: 'Hover (point at it)', selected: false },
  { label: 'Selected', selected: true },
]

// Real router links: the one for this page is Selected by the route match.
const ROUTER_LINKS = [
  { name: 'DevNavLink', label: 'NavLink' },
  { name: 'DevDivider', label: 'Divider' },
  { name: 'DevTabBar', label: 'Tab Bar' },
  { name: 'DevTooltip', label: 'Tooltip' },
]

const menuOpen = ref(false)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">NavLink</h1>
      <p class="text-text-sm text-text-subtle">
        Navbar section item. Selected follows the active route; items that open
        a menu show the chevron.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Status × Show dropdown</h2>
      <div
        class="grid w-fit grid-cols-3 gap-x-10 gap-y-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <p class="text-label-sm">Status</p>
        <p class="text-label-sm">dropdown</p>
        <p class="text-label-sm">no dropdown</p>
        <template v-for="status in STATUSES" :key="status.label">
          <p class="text-text-sm text-text-subtle">{{ status.label }}</p>
          <div>
            <AppNavLink label="Navlink" dropdown :selected="status.selected" />
          </div>
          <div>
            <AppNavLink label="Navlink" :selected="status.selected" />
          </div>
        </template>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Router links (this page is selected)</h2>
      <nav
        class="flex w-fit items-center gap-1 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppNavLink
          v-for="link in ROUTER_LINKS"
          :key="link.name"
          :to="{ name: link.name }"
          :label="link.label"
        />
      </nav>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Menu trigger</h2>
      <div
        class="flex w-fit items-center gap-4 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppNavLink
          label="More"
          dropdown
          :expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        />
        <p class="text-text-sm text-text-subtle">
          aria-expanded: {{ menuOpen }} (Tab to it to see the focus ring)
        </p>
      </div>
    </section>
  </div>
</template>
