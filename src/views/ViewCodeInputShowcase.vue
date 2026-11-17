<script setup lang="ts">
// Gallery for the one-time-code input (MEW-2289), reachable at
// /dev/code-input via the design-library shell — see routesDefault.ts.
// The Figma states (OTP Digit Input, 143:529): default, error, success,
// plus a live field that reports the code it completes.
import { ref } from 'vue'
import AppCodeInput from '@/components/code_input/AppCodeInput.vue'

const live = ref('')
const completed = ref('')
const errored = ref('123456')
const succeeded = ref('123456')
const disabled = ref('12')
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Code input</h1>
      <p class="text-s-14 text-text-subtle">
        One box per digit. Typing advances, backspace goes back, and a pasted or
        autofilled code fills every box.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Live</h2>
      <div
        class="flex flex-col items-center gap-4 rounded-12 border border-border-default p-8"
      >
        <AppCodeInput v-model="live" @complete="completed = $event" />
        <p class="text-s-14 text-text-subtle">
          Value: {{ live || '—' }} · Completed: {{ completed || '—' }}
        </p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">States</h2>
      <div
        class="flex flex-col items-center gap-8 rounded-12 border border-border-default p-8"
      >
        <AppCodeInput v-model="errored" status="error" />
        <AppCodeInput v-model="succeeded" status="success" />
        <AppCodeInput v-model="disabled" disabled />
      </div>
    </section>
  </div>
</template>
