<script setup lang="ts">
// Preview for the library AppFooter (MEW-2443) at /dev/footer, fed by the app's
// real props. Figma component set 1189:2949; each frame is one Figma size
// (the footer switches by its own width).
import { AppFooter } from '@myetherwallet/vue-common-components'
import { useFooterProps } from '@/composables/useFooterProps'

const footerProps = useFooterProps()

const SIZES = [
  { name: 'Small — 320', box: 'w-[320px]' },
  { name: 'Medium — 688', box: 'w-[688px]' },
  { name: 'Large — 1360', box: 'w-[1360px]' },
]
</script>

<template>
  <div class="flex flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Footer</h1>
      <p class="text-text-sm text-text-subtle">
        Page-level footer with grouped navigation links. Lives in
        vue-common-components 2.x; sizes switch on the footer's own width.
      </p>
    </header>

    <section v-for="s in SIZES" :key="s.name" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ s.name }}</h2>
      <div class="overflow-x-auto">
        <div :class="[s.box, 'outline outline-1 outline-border-default']">
          <AppFooter v-bind="footerProps" />
        </div>
      </div>
    </section>
  </div>
</template>
