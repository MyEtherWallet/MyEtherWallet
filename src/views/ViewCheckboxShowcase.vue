<script setup lang="ts">
// Gallery for the Checkbox design-library component (MEW-2399), reachable at
// /dev/checkbox via the design-library shell — see routesDefault.ts. Mirrors the
// Type × State matrix in Figma (component set 3822:42450). Hover and focus are
// CSS only, so those columns force them with `is-forced-*`; every other sample
// shows the real hover and Tab focus.
import { computed, ref } from 'vue'
import AppCheckbox from '@components/checkbox/AppCheckbox.vue'

const TYPES = [
  { label: 'Unselected', checked: false, indeterminate: false },
  { label: 'Selected', checked: true, indeterminate: false },
  { label: 'Indeterminate', checked: false, indeterminate: true },
]
const STATES = [
  { label: 'Default', forced: '', disabled: false },
  { label: 'Hover', forced: 'is-forced-hover', disabled: false },
  { label: 'Focused', forced: 'is-forced-focus', disabled: false },
  { label: 'Disabled', forced: '', disabled: true },
]

const remember = ref(true)
const terms = ref(false)

// Select-all over three children: the header goes indeterminate on a partial
// selection, and checking it from there selects every child (native behaviour).
const networks = ref([
  { name: 'Ethereum', checked: true },
  { name: 'Bitcoin', checked: false },
  { name: 'Solana', checked: false },
])
const allSelected = computed({
  get: () => networks.value.every(n => n.checked),
  set: value => networks.value.forEach(n => (n.checked = value)),
})
const someSelected = computed(() => networks.value.some(n => n.checked))
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Checkbox</h1>
      <p class="text-s-14 text-text-subtle">
        Selection control for forms and lists, for multi-select. Hover a box or
        Tab to it to see the real hover and focus states.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Type × State</h2>
      <div
        class="inline-grid w-fit grid-cols-5 items-center gap-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <span />
        <span
          v-for="state in STATES"
          :key="state.label"
          class="text-s-12 text-text-subtle"
        >
          {{ state.label }}
        </span>
        <template v-for="type in TYPES" :key="type.label">
          <span class="pr-8 text-s-12 text-text-subtle">
            Type={{ type.label }}
          </span>
          <!-- No-op listener keeps the samples fixed: without it defineModel
               flips the value locally on click. -->
          <div v-for="state in STATES" :key="state.label">
            <app-checkbox
              :model-value="type.checked"
              :indeterminate="type.indeterminate"
              :disabled="state.disabled"
              :class="state.forced"
              :aria-label="`${type.label} — ${state.label}`"
              @update:model-value="() => {}"
            />
          </div>
        </template>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">With label</h2>
      <div
        class="flex flex-col gap-4 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <app-checkbox v-model="remember" label="Remember me" />
        <app-checkbox
          v-model="remember"
          class="max-w-64"
          label="A longer label that wraps onto a second line keeps the box aligned with the first line"
        />
        <app-checkbox :model-value="true" disabled label="Disabled label" />
        <app-checkbox v-model="terms">
          I accept the
          <a href="#" class="text-text-brand underline" @click.prevent>
            terms of service
          </a>
        </app-checkbox>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Select all (indeterminate)</h2>
      <div
        class="flex flex-col gap-4 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <app-checkbox
          v-model="allSelected"
          :indeterminate="someSelected && !allSelected"
          label="All networks"
        />
        <div class="flex flex-col gap-4 pl-7">
          <app-checkbox
            v-for="n in networks"
            :key="n.name"
            v-model="n.checked"
            :label="n.name"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Preview only: paint the CSS hover / focus states without a pointer or Tab. */
.is-forced-hover :deep(> span[aria-hidden='true']) {
  box-shadow: 0 0 0 4px var(--background-default-hover);
}

.is-forced-hover :deep(> .bg-background-brand) {
  background-color: var(--background-brand-hover);
}

.is-forced-focus :deep(> span[aria-hidden='true']) {
  outline: 2px solid var(--border-focus);
  outline-offset: 4px;
}
</style>
