<script setup lang="ts">
// Preview for the Searchbar design-library component (MEW-1976) at
// /dev/searchbar. Figma 82:14709: Outline sits on grey surfaces, Default on
// white ones. Focus is live: Tab in for the ring, click in for the caret.
import { computed, reactive, ref } from 'vue'
import AppSearchbar from '@components/AppSearchbar.vue'

const VARIANTS = [
  { variant: 'outline', surface: 'bg-background-default' },
  { variant: 'default', surface: 'bg-background-alternative' },
] as const
const STATES = ['Default', 'Focus — Tab in', 'Typing'] as const
const models = reactive<Record<string, string>>({
  'outline-Typing': 'Type',
  'default-Typing': 'Type something',
})

const TOKENS = ['Bitcoin', 'Ethereum', 'Solana', 'Tether', 'USD Coin', 'XRP']
const filter = ref('')
const matches = computed(() =>
  TOKENS.filter((t) => t.toLowerCase().includes(filter.value.toLowerCase())),
)

const debounced = ref('')
const log = ref<string[]>([])
const push = (line: string) => {
  log.value = [line, ...log.value].slice(0, 5)
}
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Searchbar</h1>
      <p class="text-text-sm text-text-subtle">
        Text field for filtering or finding items within a list, combining a
        search icon, input area, and clear button.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Style × State</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          v-for="{ variant, surface } in VARIANTS"
          :key="variant"
          :class="[
            'flex flex-col gap-4 rounded-12 border border-border-default p-6',
            surface,
          ]"
        >
          <p class="text-text-xs text-text-muted">variant = {{ variant }}</p>
          <div v-for="state in STATES" :key="state" class="flex flex-col gap-1">
            <p class="text-text-xs text-text-muted">{{ state }}</p>
            <AppSearchbar v-model="models[`${variant}-${state}`]" :variant />
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live filter</h2>
      <div
        class="flex flex-col gap-3 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppSearchbar v-model="filter" variant="default" />
        <p class="text-text-xs text-text-muted">
          {{ matches.length }} / {{ TOKENS.length }}: {{ matches.join(', ') }}
        </p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Debounce 300 · submit · action</h2>
      <div
        class="flex flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppSearchbar
          v-model="debounced"
          variant="outline"
          :debounce="300"
          @update:model-value="push(`update:modelValue ${$event}`)"
          @submit="push(`submit ${$event}`)"
          @clear="push('clear')"
        />
        <AppSearchbar
          v-model="models.action"
          variant="outline"
          action-icon="qr-code"
          action-label="Scan"
          @action="push(`action ${$event}`)"
        />
        <ul class="text-text-xs text-text-muted">
          <li v-for="(line, i) in log" :key="i">{{ line }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>
