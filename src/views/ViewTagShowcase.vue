<script setup lang="ts">
// Gallery for the Tag design-library component (MEW-2401), reachable at
// /dev/tag via the design-library shell — see routesDefault.ts. Lets us eyeball
// the Type × Style matrix against Figma (component set 859:624), the icon
// combinations, Contrast on a dark surface and a leading avatar. Tags are
// non-interactive: nothing here hovers, focuses or clicks.
import AppTag from '@/components/tag/AppTag.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import { TAG_TYPES, TAG_VARIANTS } from '@/components/tag/types'
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Tag</h1>
      <p class="text-s-14 text-text-subtle">
        Small, non-interactive label used to categorize or highlight
        information, with optional leading/trailing icon.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Type × Style</h2>
      <div
        class="grid grid-cols-4 items-center gap-6 rounded-12 border border-border-default bg-background-default p-6"
      >
        <span />
        <span
          v-for="variant in TAG_VARIANTS"
          :key="variant"
          class="text-s-12 capitalize text-text-subtle"
        >
          {{ variant }}
        </span>
        <template v-for="type in TAG_TYPES" :key="type">
          <span class="text-s-12 capitalize text-text-subtle">{{ type }}</span>
          <div v-for="variant in TAG_VARIANTS" :key="variant">
            <AppTag
              :type="type"
              :variant="variant"
              label="Badge"
              trailing-icon="information-circle"
            />
          </div>
        </template>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Icons — none / leading / both</h2>
      <div
        class="flex flex-wrap items-center gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppTag type="success" variant="subtle" label="Completed" />
        <AppTag
          type="success"
          variant="subtle"
          label="Completed"
          leading-icon="check-circle"
        />
        <AppTag
          type="warning"
          variant="subtle"
          label="Pending"
          leading-icon="clock"
          trailing-icon="information-circle"
        />
        <AppTag type="branded" label="New" />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Contrast on a dark surface</h2>
      <div class="flex flex-wrap items-center gap-4 rounded-12 bg-black p-6">
        <AppTag
          v-for="type in TAG_TYPES"
          :key="type"
          :type="type"
          variant="contrast"
          label="Badge"
          trailing-icon="information-circle"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Leading avatar (slot)</h2>
      <div
        class="flex flex-wrap items-center gap-4 rounded-12 border border-border-default bg-white p-6"
      >
        <AppTag variant="subtle" label="Ethereum">
          <template #leading>
            <AppAvatar type="initial" size="xs" initial="E" />
          </template>
        </AppTag>
        <AppTag type="branded" variant="subtle" label="Base">
          <template #leading>
            <AppAvatar type="initial" size="xs" initial="B" />
          </template>
        </AppTag>
      </div>
    </section>
  </div>
</template>
