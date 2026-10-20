<script setup lang="ts">
// Preview for the Navbar design-library component (MEW-2463) at /dev/navbar.
// Compare against Figma Navbar 1078:1485. The breakpoint axis is the viewport
// (sm 768 / xl 1280 / 2xl 1440), not a prop, so resize the window to walk the
// four Figma columns. The dev sidebar takes width the bar still thinks it has,
// so each bar scrolls sideways when it doesn't fit. Slots hold stand-ins:
// AppNavLink / AppAddressSelector (MEW-2461 / MEW-2462) replace the link and
// wallet placeholders once they land.
import { computed, ref } from 'vue'
import AppNavbar from '@/components/navbar/AppNavbar.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'

const LINKS = ['Home', 'Portfolio', 'Stocks', 'Crypto', 'Perpetuals', 'More']

const walletSaved = ref(false)
const menuOpen = ref(false)
const scrolled = ref(false)
const log = ref<string[]>([])
const record = (event: string) => {
  log.value = [event, ...log.value].slice(0, 8)
  if (event === 'toggle-menu') menuOpen.value = !menuOpen.value
}

const bars = computed(() => [
  { title: 'Wallet saved? Off', props: { walletSaved: false } },
  { title: 'Wallet saved? On', props: { walletSaved: true } },
  {
    title: 'Live',
    props: {
      walletSaved: walletSaved.value,
      menuOpen: menuOpen.value,
      scrolled: scrolled.value,
    },
  },
])
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Navbar</h1>
      <p class="text-text-sm text-text-subtle">
        Top-level navigation: main sections, search, wallet connection,
        notifications and settings, depending on screen size.
      </p>
      <p class="text-text-xs text-text-muted">
        Current column:
        <span class="sm:hidden">0 → 768</span>
        <span class="hidden sm:inline xl:hidden">768 → 1280</span>
        <span class="hidden xl:inline 2xl:hidden">1280 → 1440</span>
        <span class="hidden 2xl:inline">1440+</span>
      </p>
    </header>

    <section v-for="bar in bars" :key="bar.title" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ bar.title }}</h2>
      <div
        v-if="bar.title === 'Live'"
        class="flex flex-wrap gap-6 text-text-sm"
      >
        <label class="flex items-center gap-2">
          <input v-model="walletSaved" type="checkbox" />
          walletSaved
        </label>
        <label class="flex items-center gap-2">
          <input v-model="menuOpen" type="checkbox" />
          menuOpen
        </label>
        <label class="flex items-center gap-2">
          <input v-model="scrolled" type="checkbox" />
          scrolled (bottom border)
        </label>
      </div>
      <div
        class="overflow-x-auto rounded-12 border border-border-default bg-background-default"
      >
        <AppNavbar
          v-bind="bar.props"
          @toggle-menu="record('toggle-menu')"
          @create-wallet="record('create-wallet')"
          @connect-wallet="record('connect-wallet')"
        >
          <template #links>
            <a
              v-for="label in LINKS"
              :key="label"
              href="#"
              class="rounded-full px-3 py-1 text-s-16 font-medium"
              @click.prevent
            >
              {{ label }}
            </a>
          </template>
          <template #search>
            <AppSearchbar class="hidden w-60 xl:block" />
            <AppBtnIcon
              icon="magnifying-glass"
              size="l"
              variant="filled"
              label="Search"
              class="xl:hidden"
            />
          </template>
          <template #wallet>
            <div
              class="flex h-10 items-center rounded-full bg-background-default px-4 text-label-base"
            >
              0x12…abcd
            </div>
          </template>
          <template #actions>
            <AppBtnIcon icon="bell" label="Notifications" />
            <AppBtnIcon icon="cog-6-tooth" label="Settings" />
          </template>
        </AppNavbar>
      </div>
    </section>

    <ol class="text-text-xs text-text-muted">
      <li v-for="(event, i) in log" :key="i">{{ event }}</li>
      <li v-if="!log.length">Emits show up here.</li>
    </ol>
  </div>
</template>
