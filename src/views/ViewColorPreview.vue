<template>
  <div class="flex flex-col gap-10 pb-16">
    <!-- Header -->
    <header class="flex flex-col gap-2 pt-4">
      <h1 class="text-s-32 font-bold">Colors</h1>
      <p class="text-s-16 text-fg-subtle max-w-[70ch]">
        Every color in the app. Mirrors the
        <span class="font-medium text-fg">MEW Web App Design Library</span>
        (Figma page <span class="font-mono">🎨 Colors</span>, node
        <span class="font-mono">25:126</span>). Values are read from the live
        stylesheet at runtime, so this page cannot drift from
        <span class="font-mono">assets/main.css</span>.
      </p>
      <p class="text-s-14 text-fg-muted max-w-[70ch]">
        Dark values are authored in code, not published in Figma, and dark mode
        is not enabled in the app — the dark column below is scoped to its own
        container so it can be reviewed here.
      </p>
    </header>

    <!-- ---------- Semantic tokens ---------- -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-s-24 font-bold">Semantic tokens</h2>
        <p class="text-s-14 text-fg-subtle max-w-[70ch]">
          What components should use. These are the only colors that change
          between themes. Contrast is measured against that theme's
          <span class="font-mono">surface</span> and rated for normal body text
          (AA needs 4.5, AAA needs 7).
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[860px]">
          <thead>
            <tr class="text-left text-s-11 font-bold uppercase tracking-sp-06 text-fg-subtle">
              <th class="py-2 pr-4 font-bold">Token</th>
              <th class="py-2 pr-4 font-bold">Utility</th>
              <th class="py-2 pr-4 font-bold" colspan="2">Light</th>
              <th class="py-2 pr-4 font-bold" colspan="2">Dark</th>
              <th class="py-2 pr-4 font-bold">Figma</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="token in SEMANTIC"
              :key="token.name"
              class="border-t border-line align-middle"
            >
              <td class="py-2 pr-4 text-s-14 font-medium whitespace-nowrap">
                {{ token.name }}
                <span v-if="token.added" class="text-fg-muted" title="Extends Figma's published set">✚</span>
              </td>
              <td class="py-2 pr-4 text-s-12 font-mono text-fg-subtle whitespace-nowrap">
                {{ token.utility }}
              </td>

              <!-- Light -->
              <td class="py-2 pr-2">
                <span
                  class="block w-14 h-8 rounded-8 border border-line"
                  :class="token.swatch"
                />
              </td>
              <td class="py-2 pr-4 text-s-12 font-mono whitespace-nowrap">
                <span>{{ resolved.light[token.name] ?? '—' }}</span>
                <span v-if="token.onSurface" class="block text-fg-muted">
                  {{ contrast.light[token.name] }}
                </span>
              </td>

              <!-- Dark -->
              <td class="py-2 pr-2">
                <span
                  class="block w-14 h-8 rounded-8 border border-line"
                  :class="token.swatch"
                  data-theme="dark"
                />
              </td>
              <td class="py-2 pr-4 text-s-12 font-mono whitespace-nowrap">
                <span>{{ resolved.dark[token.name] ?? '—' }}</span>
                <span v-if="token.onSurface" class="block text-fg-muted">
                  {{ contrast.dark[token.name] }}
                </span>
              </td>

              <td class="py-2 pr-4 text-s-12 text-fg-muted">{{ token.figma ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ---------- Side-by-side component preview ---------- -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-s-24 font-bold">In context</h2>
        <p class="text-s-14 text-fg-subtle">
          The same markup rendered in both themes.
        </p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="mode in (['light', 'dark'] as const)"
          :key="mode"
          :data-theme="mode"
          class="bg-page rounded-16 p-5 flex flex-col gap-4 border border-line"
        >
          <p class="text-s-11 font-bold uppercase tracking-sp-06 text-fg-subtle">
            {{ mode }}
          </p>
          <div class="bg-surface rounded-12 p-4 shadow-container flex flex-col gap-3">
            <p class="text-s-17 font-medium text-fg">Surface with primary text</p>
            <p class="text-s-14 text-fg-subtle">
              Subtle text for secondary copy, then
              <span class="text-fg-muted">muted</span> for tertiary.
            </p>
            <div class="h-px bg-line" />
            <div class="flex flex-wrap gap-2">
              <button class="bg-brand text-fg-on-fill rounded-full px-4 py-2 text-s-14 font-medium">
                Brand
              </button>
              <button class="bg-brand-subtle text-brand rounded-full px-4 py-2 text-s-14 font-medium">
                Brand subtle
              </button>
              <button class="bg-surface-inverse text-fg-on-inverse rounded-full px-4 py-2 text-s-14 font-medium">
                Inverse
              </button>
              <button class="bg-surface-strong text-fg rounded-full px-4 py-2 text-s-14 font-medium">
                Strong
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="bg-success-subtle text-success rounded-full px-3 py-1 text-s-12 font-medium">Success</span>
              <span class="bg-warning-subtle text-warning rounded-full px-3 py-1 text-s-12 font-medium">Warning</span>
              <span class="bg-error-subtle text-error rounded-full px-3 py-1 text-s-12 font-medium">Error</span>
              <span class="bg-violet-subtle text-violet rounded-full px-3 py-1 text-s-12 font-medium">Enkrypt</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ---------- Primitives ---------- -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-s-24 font-bold">Primitives</h2>
        <p class="text-s-14 text-fg-subtle max-w-[70ch]">
          The raw ramps. Reach for these only when a color must
          <em>not</em> change between themes — otherwise use a semantic token
          above, or dark mode will not follow.
        </p>
      </div>

      <div
        v-for="ramp in RAMPS"
        :key="ramp.name"
        class="flex flex-col gap-2"
      >
        <h3 class="text-s-15 font-semibold capitalize">{{ ramp.name }}</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="swatch in ramp.swatches"
            :key="swatch.cls"
            class="flex flex-col gap-1 w-[92px]"
          >
            <span
              class="block h-16 rounded-12 border border-line"
              :class="swatch.cls"
              :ref="(el) => registerSwatch(el, swatch.cls)"
            />
            <span class="text-s-12 font-medium">{{ swatch.step }}</span>
            <span class="text-s-11 font-mono text-fg-subtle">
              {{ primitiveValues[swatch.cls] ?? '' }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, type ComponentPublicInstance } from 'vue'

/**
 * Colour reference page (/colors).
 *
 * Two constraints shape how this is written:
 *
 * 1. Tailwind v4 tree-shakes theme variables that no utility references, so
 *    `var(--color-purple-950)` alone would resolve to nothing in a production
 *    build. Every swatch therefore renders through a real utility class.
 * 2. Tailwind's scanner reads source text, so a class name built by string
 *    interpolation is never found. The class names below are written out as
 *    literals for that reason — do not refactor them into template strings.
 *
 * Colour VALUES are never written here; they are read back off the rendered
 * swatches, which keeps this page honest about what main.css actually emits.
 */

/** Steps run dark -> light to match how the ramps read in Figma. */
const STEPS = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50]

const RAMPS = [
  {
    name: 'brand',
    classes:
      'bg-brand-950 bg-brand-900 bg-brand-800 bg-brand-700 bg-brand-600 bg-brand-500 bg-brand-400 bg-brand-300 bg-brand-200 bg-brand-100 bg-brand-50',
  },
  {
    name: 'purple',
    classes:
      'bg-purple-950 bg-purple-900 bg-purple-800 bg-purple-700 bg-purple-600 bg-purple-500 bg-purple-400 bg-purple-300 bg-purple-200 bg-purple-100 bg-purple-50',
  },
  {
    name: 'violet',
    classes:
      'bg-violet-950 bg-violet-900 bg-violet-800 bg-violet-700 bg-violet-600 bg-violet-500 bg-violet-400 bg-violet-300 bg-violet-200 bg-violet-100 bg-violet-50',
  },
  {
    name: 'red',
    classes:
      'bg-red-950 bg-red-900 bg-red-800 bg-red-700 bg-red-600 bg-red-500 bg-red-400 bg-red-300 bg-red-200 bg-red-100 bg-red-50',
  },
  {
    name: 'green',
    classes:
      'bg-green-950 bg-green-900 bg-green-800 bg-green-700 bg-green-600 bg-green-500 bg-green-400 bg-green-300 bg-green-200 bg-green-100 bg-green-50',
  },
  {
    name: 'orange',
    classes:
      'bg-orange-950 bg-orange-900 bg-orange-800 bg-orange-700 bg-orange-600 bg-orange-500 bg-orange-400 bg-orange-300 bg-orange-200 bg-orange-100 bg-orange-50',
  },
].map((ramp) => ({
  name: ramp.name,
  swatches: ramp.classes
    .split(' ')
    .map((cls, i) => ({ cls, step: String(STEPS[i]) })),
}))

// Neutral is its own shape: white/black bookends instead of 50 and 950.
RAMPS.push({
  name: 'neutral',
  swatches: [
    { cls: 'bg-black', step: 'black' },
    { cls: 'bg-neutral-900', step: '900' },
    { cls: 'bg-neutral-800', step: '800' },
    { cls: 'bg-neutral-700', step: '700' },
    { cls: 'bg-neutral-600', step: '600' },
    { cls: 'bg-neutral-500', step: '500' },
    { cls: 'bg-neutral-400', step: '400' },
    { cls: 'bg-neutral-300', step: '300' },
    { cls: 'bg-neutral-200', step: '200' },
    { cls: 'bg-neutral-100', step: '100' },
    { cls: 'bg-neutral-50', step: '50' },
    { cls: 'bg-white', step: 'white' },
  ],
})

/**
 * `added: true` marks a token that extends Figma's published set — it covers a
 * hover state, muted text, or a status tint the 16 Figma tokens don't express
 * and that dark mode needs. Pending design sign-off.
 * `onSurface` requests a contrast reading, for tokens used as text or icons.
 */
const SEMANTIC = [
  { name: 'page', utility: 'bg-page', swatch: 'bg-page', figma: 'background/base' },
  { name: 'surface', utility: 'bg-surface', swatch: 'bg-surface', figma: 'background/surface' },
  { name: 'surface-hover', utility: 'bg-surface-hover', swatch: 'bg-surface-hover', added: true },
  { name: 'surface-strong', utility: 'bg-surface-strong', swatch: 'bg-surface-strong', added: true },
  { name: 'surface-inverse', utility: 'bg-surface-inverse', swatch: 'bg-surface-inverse', added: true },
  { name: 'fg', utility: 'text-fg', swatch: 'bg-fg', figma: 'foreground/default', onSurface: true },
  { name: 'fg-subtle', utility: 'text-fg-subtle', swatch: 'bg-fg-subtle', figma: 'foreground/subtle', onSurface: true },
  { name: 'fg-muted', utility: 'text-fg-muted', swatch: 'bg-fg-muted', added: true, onSurface: true },
  { name: 'fg-on-fill', utility: 'text-fg-on-fill', swatch: 'bg-fg-on-fill', figma: 'foreground/inverted' },
  { name: 'fg-on-inverse', utility: 'text-fg-on-inverse', swatch: 'bg-fg-on-inverse', added: true },
  { name: 'line', utility: 'border-line', swatch: 'bg-line', figma: 'border/default' },
  { name: 'line-strong', utility: 'border-line-strong', swatch: 'bg-line-strong', added: true },
  { name: 'brand', utility: 'bg-brand', swatch: 'bg-brand', figma: 'foreground|border/brand', onSurface: true },
  { name: 'brand-hover', utility: 'bg-brand-hover', swatch: 'bg-brand-hover', added: true },
  { name: 'brand-subtle', utility: 'bg-brand-subtle', swatch: 'bg-brand-subtle', figma: 'background/brand-subtle' },
  { name: 'brand-subtle-hover', utility: 'bg-brand-subtle-hover', swatch: 'bg-brand-subtle-hover', added: true },
  { name: 'success', utility: 'text-success', swatch: 'bg-success', figma: 'background|foreground/success', onSurface: true },
  { name: 'success-subtle', utility: 'bg-success-subtle', swatch: 'bg-success-subtle', added: true },
  { name: 'warning', utility: 'text-warning', swatch: 'bg-warning', figma: 'background|foreground/warning', onSurface: true },
  { name: 'warning-subtle', utility: 'bg-warning-subtle', swatch: 'bg-warning-subtle', added: true },
  { name: 'error', utility: 'text-error', swatch: 'bg-error', figma: 'background|foreground|border/error', onSurface: true },
  { name: 'error-subtle', utility: 'bg-error-subtle', swatch: 'bg-error-subtle', added: true },
  { name: 'violet', utility: 'text-violet', swatch: 'bg-violet', added: true, onSurface: true },
  { name: 'violet-subtle', utility: 'bg-violet-subtle', swatch: 'bg-violet-subtle', added: true },
]

const resolved = reactive<Record<'light' | 'dark', Record<string, string>>>({
  light: {},
  dark: {},
})
const contrast = reactive<Record<'light' | 'dark', Record<string, string>>>({
  light: {},
  dark: {},
})
const primitiveValues = ref<Record<string, string>>({})
const swatchEls = new Map<string, HTMLElement>()

const registerSwatch = (
  el: Element | ComponentPublicInstance | null,
  cls: string,
) => {
  if (el instanceof HTMLElement) swatchEls.set(cls, el)
}

const toHex = (rgb: string): string => {
  const parts = rgb.match(/\d+(\.\d+)?/g)
  if (!parts || parts.length < 3) return rgb
  const [r, g, b] = parts.map(Number)
  const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
  // Surface any alpha rather than silently dropping it.
  const alpha = parts[3] !== undefined ? Number(parts[3]) : 1
  return alpha < 1 ? `${hex} / ${alpha}` : hex
}

/** WCAG 2.1 relative luminance. */
const luminance = (rgb: string): number => {
  const parts = rgb.match(/\d+(\.\d+)?/g)
  if (!parts) return 0
  const [r, g, b] = parts.slice(0, 3).map((n) => {
    const c = Number(n) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (a: string, b: string): number => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/**
 * Reads each token's value out of a detached probe rather than parsing the
 * stylesheet. The dark block is scoped to `[data-theme='dark']` (not
 * `:root[data-theme='dark']`) precisely so a container like this resolves the
 * dark palette without touching the document.
 */
const measure = () => {
  for (const mode of ['light', 'dark'] as const) {
    const probe = document.createElement('div')
    probe.setAttribute('data-theme', mode)
    probe.style.position = 'fixed'
    probe.style.left = '-9999px'
    probe.style.pointerEvents = 'none'
    document.body.appendChild(probe)

    const read = (cls: string) => {
      const el = document.createElement('div')
      el.className = cls
      probe.appendChild(el)
      const value = getComputedStyle(el).backgroundColor
      probe.removeChild(el)
      return value
    }

    const surface = read('bg-surface')
    for (const token of SEMANTIC) {
      const raw = read(token.swatch)
      resolved[mode][token.name] = toHex(raw)
      if (token.onSurface) {
        const r = ratio(raw, surface)
        const rating = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'fail'
        contrast[mode][token.name] = `${r.toFixed(1)}:1 ${rating}`
      }
    }
    document.body.removeChild(probe)
  }

  // Primitives are theme-independent, so read them straight off the DOM.
  const values: Record<string, string> = {}
  for (const [cls, el] of swatchEls) {
    values[cls] = toHex(getComputedStyle(el).backgroundColor)
  }
  primitiveValues.value = values
}

onMounted(measure)
</script>
