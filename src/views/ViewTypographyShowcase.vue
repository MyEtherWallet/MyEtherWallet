<script setup lang="ts">
// Reference page for the Typography design-library tokens (MEW-2031), at
// /dev/typography. Mirrors Figma 📝 Typography (node 45:6165).
//
// Class names are written out as literals so Tailwind's scanner finds them —
// do not refactor them into template strings, or the utilities stop being
// emitted and every sample here silently falls back to the page default.
//
// Computed values are read off the rendered samples rather than written down,
// so a token that drifts from this table shows up as a mismatch.
import { ref, computed, onMounted } from 'vue'

type TypeToken = {
  figma: string
  className: string
  weight: number
  size: number
  lineHeight: number
  tracking: string
  uppercase: boolean
}

const TOKENS: TypeToken[] = [
  {
    figma: 'label/xs',
    className: 'text-label-xs',
    weight: 600,
    size: 12,
    lineHeight: 18,
    tracking: '-2%',
    uppercase: false,
  },
  {
    figma: 'label/sm',
    className: 'text-label-sm',
    weight: 600,
    size: 14,
    lineHeight: 20,
    tracking: '-2%',
    uppercase: false,
  },
  {
    figma: 'label/base',
    className: 'text-label-base',
    weight: 600,
    size: 16,
    lineHeight: 22,
    tracking: '-2%',
    uppercase: false,
  },
  {
    figma: 'text/xs',
    className: 'text-text-xs',
    weight: 400,
    size: 12,
    lineHeight: 18,
    tracking: '0%',
    uppercase: false,
  },
  {
    figma: 'text/sm',
    className: 'text-text-sm',
    weight: 400,
    size: 14,
    lineHeight: 20,
    tracking: '0%',
    uppercase: false,
  },
  {
    figma: 'text/base',
    className: 'text-text-base',
    weight: 400,
    size: 16,
    lineHeight: 22,
    tracking: '0%',
    uppercase: false,
  },
  {
    figma: 'heading/base',
    className: 'text-heading-base',
    weight: 700,
    size: 20,
    lineHeight: 22,
    tracking: '-2%',
    uppercase: false,
  },
  {
    figma: 'heading/lg-subtle',
    className: 'text-heading-lg-subtle',
    weight: 400,
    size: 24,
    lineHeight: 24,
    tracking: '-2%',
    uppercase: false,
  },
  {
    figma: 'heading/lg',
    className: 'text-heading-lg',
    weight: 700,
    size: 24,
    lineHeight: 26,
    tracking: '-2%',
    uppercase: false,
  },
  {
    figma: 'heading/xl',
    className: 'text-heading-xl',
    weight: 700,
    size: 28,
    lineHeight: 32,
    tracking: '-3%',
    uppercase: false,
  },
  {
    figma: 'heading/2xl',
    className: 'text-heading-2xl',
    weight: 700,
    size: 32,
    lineHeight: 36,
    tracking: '-3%',
    uppercase: false,
  },
  {
    figma: 'heading/3xl',
    className: 'text-heading-3xl',
    weight: 700,
    size: 40,
    lineHeight: 44,
    tracking: '-3%',
    uppercase: false,
  },
  {
    figma: 'heading/4xl',
    className: 'text-heading-4xl',
    weight: 700,
    size: 52,
    lineHeight: 56,
    tracking: '-4%',
    uppercase: false,
  },
  {
    figma: 'special/overline',
    className: 'text-overline',
    weight: 400,
    size: 11,
    lineHeight: 15,
    tracking: '0.6px',
    uppercase: true,
  },
]

const SAMPLE_TEXT = 'Send and swap crypto'

type Measured = {
  fontSize: string
  lineHeight: string
  letterSpacing: string
  fontWeight: string
  textTransform: string
}

const root = ref<HTMLElement | null>(null)
const measured = ref<Record<string, Measured>>({})

/** Figma writes tracking as a percentage of the size, except overline (absolute). */
const expectedTrackingPx = (token: TypeToken): number => {
  if (token.tracking.endsWith('%')) {
    return (token.size * parseFloat(token.tracking)) / 100
  }
  return parseFloat(token.tracking)
}

const toNumber = (value: string | undefined): number =>
  value === undefined || value === 'normal' ? 0 : parseFloat(value)

const close = (a: number, b: number): boolean => Math.abs(a - b) < 0.05

const mismatches = (token: TypeToken): string[] => {
  const actual = measured.value[token.className]
  if (!actual) return []
  const failed: string[] = []
  if (!close(toNumber(actual.fontSize), token.size)) failed.push('size')
  if (!close(toNumber(actual.lineHeight), token.lineHeight)) {
    failed.push('line-height')
  }
  if (!close(toNumber(actual.letterSpacing), expectedTrackingPx(token))) {
    failed.push('tracking')
  }
  if (!close(toNumber(actual.fontWeight), token.weight)) failed.push('weight')
  const expectedTransform = token.uppercase ? 'uppercase' : 'none'
  if (actual.textTransform !== expectedTransform) failed.push('case')
  return failed
}

const formatComputed = (token: TypeToken): string => {
  const actual = measured.value[token.className]
  if (!actual) return '—'
  const tracking =
    actual.letterSpacing === 'normal' ? '0px' : actual.letterSpacing
  return `${actual.fontWeight} · ${actual.fontSize}/${actual.lineHeight} · ${tracking}`
}

const failingCount = computed(
  () => TOKENS.filter(token => mismatches(token).length > 0).length,
)

onMounted(() => {
  if (!root.value) return
  const result: Record<string, Measured> = {}
  const samples = root.value.querySelectorAll<HTMLElement>('[data-type-token]')
  for (const sample of samples) {
    const key = sample.dataset.typeToken
    if (!key) continue
    const style = getComputedStyle(sample)
    result[key] = {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      fontWeight: style.fontWeight,
      textTransform: style.textTransform,
    }
  }
  measured.value = result
})
</script>

<template>
  <div ref="root" class="p-8 flex flex-col gap-10 max-w-5xl mx-auto">
    <header class="flex flex-col gap-2">
      <h1 class="text-s-24 font-bold text-t-default">Typography</h1>
      <p class="text-s-14 text-info max-w-[70ch]">
        The {{ TOKENS.length }} text styles from
        <span class="font-medium text-t-default">
          MEW Web App — Design Library
        </span>
        (Figma page 📝 Typography, node
        <span class="font-mono">45:6165</span>). Each class carries size,
        line-height, letter-spacing and weight, so one class is the whole style.
        Values in the Computed column are read off the rendered samples, so this
        page cannot drift from <span class="font-mono">assets/main.css</span>.
      </p>
      <p
        class="text-s-14 max-w-[70ch]"
        :class="failingCount ? 'text-error' : 'text-info'"
      >
        <template v-if="failingCount">
          {{ failingCount }} token(s) do not match the Figma spec — see the
          Status column.
        </template>
        <template v-else>
          All {{ TOKENS.length }} tokens match the Figma spec.
        </template>
      </p>
    </header>

    <!-- Scale -->
    <section class="flex flex-col gap-3">
      <h2 class="text-s-16 font-semibold text-t-default">Scale</h2>
      <div
        class="flex flex-col gap-5 rounded-12 border border-grey-10 bg-white p-6"
      >
        <div
          v-for="token in TOKENS"
          :key="token.className"
          class="flex flex-col gap-1"
        >
          <span class="text-s-11 uppercase text-info tracking-sp-06">
            {{ token.figma }}
          </span>
          <p
            :data-type-token="token.className"
            :class="token.className"
            class="text-t-default"
          >
            {{ SAMPLE_TEXT }}
          </p>
        </div>
      </div>
    </section>

    <!-- Dev handoff -->
    <section class="flex flex-col gap-3">
      <h2 class="text-s-16 font-semibold text-t-default">Dev handoff</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[900px]">
          <thead>
            <tr
              class="text-left text-s-11 font-bold uppercase tracking-sp-06 text-info"
            >
              <th class="py-2 pr-4 font-bold">Style name</th>
              <th class="py-2 pr-4 font-bold">Class</th>
              <th class="py-2 pr-4 font-bold">Weight</th>
              <th class="py-2 pr-4 font-bold">Size / Line-height</th>
              <th class="py-2 pr-4 font-bold">Letter-spacing</th>
              <th class="py-2 pr-4 font-bold">Case</th>
              <th class="py-2 pr-4 font-bold">Computed</th>
              <th class="py-2 pr-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="token in TOKENS"
              :key="token.className"
              class="border-t border-grey-10 align-middle"
            >
              <td class="py-2 pr-4 text-s-14 font-medium whitespace-nowrap">
                {{ token.figma }}
              </td>
              <td
                class="py-2 pr-4 text-s-12 font-mono text-info whitespace-nowrap"
              >
                {{ token.className }}
              </td>
              <td class="py-2 pr-4 text-s-14 whitespace-nowrap">
                {{ token.weight }}
              </td>
              <td class="py-2 pr-4 text-s-14 whitespace-nowrap">
                {{ token.size }}px / {{ token.lineHeight }}px
              </td>
              <td class="py-2 pr-4 text-s-14 whitespace-nowrap">
                {{ token.tracking }}
              </td>
              <td class="py-2 pr-4 text-s-14 whitespace-nowrap">
                {{ token.uppercase ? 'UPPERCASE' : 'None' }}
              </td>
              <td
                class="py-2 pr-4 text-s-12 font-mono text-info whitespace-nowrap"
              >
                {{ formatComputed(token) }}
              </td>
              <td class="py-2 pr-4 text-s-12 whitespace-nowrap">
                <span
                  v-if="mismatches(token).length"
                  class="font-medium text-error"
                >
                  {{ mismatches(token).join(', ') }}
                </span>
                <span v-else class="text-mew-green-text">match</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Overrides -->
    <section class="flex flex-col gap-3">
      <h2 class="text-s-16 font-semibold text-t-default">Overrides</h2>
      <p class="text-s-14 text-info max-w-[70ch]">
        A token sets weight, line-height and letter-spacing as defaults, so a
        <span class="font-mono">font-*</span>,
        <span class="font-mono">leading-*</span> or
        <span class="font-mono">tracking-*</span> utility still wins —
        regardless of class order.
      </p>
      <div
        class="flex flex-col gap-4 rounded-12 border border-grey-10 bg-white p-6"
      >
        <div class="flex flex-col gap-1">
          <span class="text-s-11 uppercase text-info tracking-sp-06">
            text-heading-lg
          </span>
          <p class="text-heading-lg text-t-default">{{ SAMPLE_TEXT }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-s-11 uppercase text-info tracking-sp-06">
            text-heading-lg font-normal
          </span>
          <p class="text-heading-lg font-normal text-t-default">
            {{ SAMPLE_TEXT }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-s-11 uppercase text-info tracking-sp-06">
            font-normal text-heading-lg
          </span>
          <p class="font-normal text-heading-lg text-t-default">
            {{ SAMPLE_TEXT }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
