<script setup lang="ts">
// Preview for AppInputNaked (MEW-2404) at /dev/input-naked — Figma component
// set 2822:1751. Focus / Typing are real states: click a field to see them.
import { computed, reactive, ref } from 'vue'
import AppInputNaked from '@/components/input_naked/AppInputNaked.vue'
import AppToggle from '@components/AppToggle.vue'

type Row = {
  state: string
  value: string
  props?: Record<string, unknown>
  hasError: boolean
}

const ROWS: Row[] = [
  { state: 'Default', value: '', hasError: true },
  { state: 'Focus — click the field', value: '', hasError: false },
  { state: 'Typing / Filled', value: '24', hasError: true },
  { state: 'Disabled', value: '', props: { disabled: true }, hasError: false },
  { state: 'Loading', value: '24', props: { loading: true }, hasError: false },
]

const models = reactive<Record<string, string>>({})
for (const row of ROWS) {
  models[`${row.state}-false`] = row.value
  models[`${row.state}-true`] = row.value
}

// Playground
const amount = ref('')
const isError = ref(false)
const isLoading = ref(false)
const isDisabled = ref(false)
const conversion = computed(() =>
  amount.value ? `≈ ${(Number(amount.value) / 2500).toFixed(4)} ETH` : '',
)

const tokenAmount = ref('0.5')
const longAmount = ref('123456789.12')
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Input Naked</h1>
      <p class="text-s-14 text-text-subtle">
        Borderless input variant used across transaction flows
        (buy/trade/swap/perps) for entering numeric amounts.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">States</h2>
      <div
        class="grid grid-cols-3 items-center gap-x-10 gap-y-8 rounded-12 border border-border-default p-10"
      >
        <span />
        <span class="text-s-14 text-text-subtle">Error=false</span>
        <span class="text-s-14 text-text-subtle">Error=true</span>
        <template v-for="row in ROWS" :key="row.state">
          <span class="text-s-14 text-text-subtle">{{ row.state }}</span>
          <AppInputNaked
            v-for="error in [false, true]"
            :class="{ invisible: error && !row.hasError }"
            :key="`${row.state}-${error}`"
            v-model="models[`${row.state}-${error}`]"
            v-bind="row.props"
            :error="error"
            :label="`${row.state} amount`"
            info-message="Info message"
            conversion="≈ 0.0513 ETH"
          />
        </template>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Playground</h2>
      <div
        class="flex flex-col gap-6 rounded-12 border border-border-default p-10"
      >
        <div class="flex flex-wrap gap-6">
          <AppToggle v-model="isError" label="Error" />
          <AppToggle v-model="isLoading" label="Loading" />
          <AppToggle v-model="isDisabled" label="Disabled" />
        </div>
        <AppInputNaked
          v-model="amount"
          :error="isError"
          :loading="isLoading"
          :disabled="isDisabled"
          :conversion="conversion"
          label="Playground amount"
          info-message="Enter an amount in USD"
        />
        <p class="text-s-12 text-text-subtle">
          v-model: <code>{{ JSON.stringify(amount) }}</code>
        </p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Token currency · No currency</h2>
      <div
        class="flex flex-wrap gap-16 rounded-12 border border-border-default p-10"
      >
        <AppInputNaked
          v-model="tokenAmount"
          currency="ETH"
          :max-decimals="6"
          label="ETH amount"
          conversion="≈ $1,250.00"
        />
        <AppInputNaked
          v-model="tokenAmount"
          :show-currency="false"
          label="Amount without currency"
          info-message="No currency prefix"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">
        Long value (constrained to 240px) — type to see it step down
      </h2>
      <div class="flex flex-wrap gap-10">
        <div class="flex flex-col gap-2">
          <span class="text-s-12 text-text-subtle">autoScale (default)</span>
          <div class="w-60 rounded-12 border border-border-default p-4">
            <AppInputNaked
              v-model="longAmount"
              label="Long amount, auto-scaled"
              conversion="≈ 49,382.7160 ETH"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-s-12 text-text-subtle">:auto-scale="false"</span>
          <div class="w-60 rounded-12 border border-border-default p-4">
            <AppInputNaked
              v-model="longAmount"
              :auto-scale="false"
              label="Long amount, fixed size"
              conversion="≈ 49,382.7160 ETH"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
