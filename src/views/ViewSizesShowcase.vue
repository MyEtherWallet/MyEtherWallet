<script setup lang="ts">
// Gallery for the size scale (MEW-2364), reachable at /dev/sizes via the
// design-library shell — see routesDefault.ts. Renders the 35 tokens as bars
// sized from the `--size-*` CSS vars (main.css) and prints the px/rem from
// `sizeScale.ts`, so a drift between the CSS contract and the TS map is visible
// at a glance. On mount it also reads each var back and flags any mismatch.
import { onMounted, ref } from 'vue'
import {
  SIZE,
  SIZE_TOKENS,
  sizeVar,
  type SizeToken,
} from '@/components/sizeScale'

const drift = ref<SizeToken[]>([])

onMounted(() => {
  const root = getComputedStyle(document.documentElement)
  const rootPx = parseFloat(root.fontSize) || 16
  drift.value = SIZE_TOKENS.filter(token => {
    const raw = root.getPropertyValue(sizeVar(token)).trim()
    if (!raw) return true // var missing entirely
    const cssPx = raw.endsWith('rem')
      ? parseFloat(raw) * rootPx
      : parseFloat(raw)
    return Math.round(cssPx) !== SIZE[token]
  })
})
</script>

<template>
  <div class="p-8 flex flex-col gap-8 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Sizes</h1>
      <p class="text-s-14 text-info">
        The one size scale — 35 tokens, identical to Tailwind's default spacing
        (<code>w-4</code>, <code>p-2.5</code>, <code>size-10</code>). Bars are
        drawn from the <code>--size-*</code> CSS vars; px/rem come from
        <code>sizeScale.ts</code>.
      </p>
    </header>

    <p
      v-if="drift.length"
      class="rounded-8 bg-error-10 text-error text-s-14 px-4 py-3"
    >
      ⚠︎ Drift — these CSS vars don't match sizeScale.ts:
      {{ drift.map(t => sizeVar(t)).join(', ') }}
    </p>
    <p v-else class="rounded-8 bg-success/10 text-success text-s-14 px-4 py-3">
      ✓ All 35 <code>--size-*</code> vars match <code>sizeScale.ts</code>.
    </p>

    <ul class="flex flex-col gap-2">
      <li
        v-for="token in SIZE_TOKENS"
        :key="String(token)"
        class="flex items-center gap-4"
      >
        <span class="w-24 shrink-0 text-s-13 font-medium text-t-default"
          >size/{{ token }}</span
        >
        <span class="w-28 shrink-0 text-s-12 text-info tabular-nums">
          {{ SIZE[token] }}px · {{ SIZE[token] / 16 }}rem
        </span>
        <span class="flex-1 min-w-0">
          <span
            class="block h-3 rounded-[2px] bg-primary"
            :style="{ width: `var(${sizeVar(token)})` }"
          />
        </span>
      </li>
    </ul>
  </div>
</template>
