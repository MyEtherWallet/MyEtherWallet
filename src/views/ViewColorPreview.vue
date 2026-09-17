<template>
  <div class="flex flex-col gap-10 pb-16">
    <!-- ---------- Header ---------- -->
    <header class="flex flex-col gap-2 pt-4">
      <h1 class="text-s-32 font-bold">Colors</h1>
      <p class="text-s-16 text-text-subtle max-w-[70ch]">
        Every color in the app. Mirrors the
        <span class="font-medium text-text-default"
          >MEW Web App &mdash; Design Library</span
        >
        (Figma page <span class="font-mono">&#127912; Colors</span>, node
        <span class="font-mono">25:126</span>). Values are read back off the
        rendered swatches at runtime, so this page cannot drift from
        <span class="font-mono">assets/main.css</span>.
      </p>
      <p class="text-s-14 text-text-muted max-w-[70ch]">
        All 96 semantic tokens below are published Figma variables. Their dark
        values are authored in code &mdash; Figma publishes a light
        &ldquo;Base&rdquo; mode only &mdash; but every one resolves to an
        existing ramp step. Dark mode is not enabled app-wide yet; the dark
        column is scoped to its own container so it can be reviewed here.
      </p>
    </header>

    <!-- ---------- Semantic tokens ---------- -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-s-24 font-bold">Semantic tokens</h2>
        <p class="text-s-14 text-text-subtle max-w-[70ch]">
          What components should use &mdash; the only colors that change between
          themes. Contrast is measured against that theme&rsquo;s
          <span class="font-mono">background/alternative</span> and rated for
          normal body text (AA needs 4.5, AAA needs 7). Tokens that sit on a
          filled or inverted surface by definition are not rated.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[900px]">
          <thead>
            <tr
              class="text-left text-s-11 font-bold uppercase tracking-sp-06 text-text-subtle"
            >
              <th class="py-2 pr-4 font-bold">Token</th>
              <th class="py-2 pr-4 font-bold">Utility prefix</th>
              <th class="py-2 pr-4 font-bold" colspan="2">Light</th>
              <th class="py-2 pr-4 font-bold" colspan="2">Dark</th>
              <th class="py-2 pr-4 font-bold">Primitive</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="group in GROUPS" :key="group">
              <tr>
                <th
                  colspan="7"
                  class="pt-6 pb-1 text-left text-s-12 font-bold text-text-default"
                >
                  {{ group }}
                </th>
              </tr>
              <tr
                v-for="token in byGroup(group)"
                :key="token.name"
                class="border-t border-border-default align-middle"
              >
                <td class="py-2 pr-4 text-s-14 font-medium whitespace-nowrap">
                  {{ token.name }}
                </td>
                <td
                  class="py-2 pr-4 text-s-12 font-mono text-text-subtle whitespace-nowrap"
                >
                  {{ token.token }}
                </td>

                <!-- Light -->
                <td class="py-2 pr-2">
                  <span
                    class="block w-14 h-8 rounded-8 border border-border-default"
                    :class="token.swatch"
                  />
                </td>
                <td class="py-2 pr-4 text-s-12 font-mono whitespace-nowrap">
                  <span>{{ resolved.light[token.name] ?? '&mdash;' }}</span>
                  <span v-if="token.onSurface" class="block text-text-muted">
                    {{ contrast.light[token.name] }}
                  </span>
                </td>

                <!-- Dark -->
                <td class="py-2 pr-2">
                  <span
                    class="block w-14 h-8 rounded-8 border border-border-default"
                    :class="token.swatch"
                    data-theme="dark"
                  />
                </td>
                <td class="py-2 pr-4 text-s-12 font-mono whitespace-nowrap">
                  <span>{{ resolved.dark[token.name] ?? '&mdash;' }}</span>
                  <span v-if="token.onSurface" class="block text-text-muted">
                    {{ contrast.dark[token.name] }}
                  </span>
                </td>

                <td
                  class="py-2 pr-4 text-s-12 text-text-muted whitespace-nowrap"
                >
                  {{ token.alias }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ---------- Primitives ---------- -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-s-24 font-bold">Primitives</h2>
        <p class="text-s-14 text-text-subtle max-w-[70ch]">
          The raw ramps the semantic tokens alias. Deliberately
          <span class="font-medium">not</span> exposed as Tailwind utilities, so
          there is no <span class="font-mono">bg-brand-700</span> to reach for
          by accident &mdash; these swatches read the custom properties
          directly.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <div v-for="ramp in RAMPS" :key="ramp.name" class="flex flex-col gap-1">
          <p
            class="text-s-11 font-bold uppercase tracking-sp-06 text-text-subtle"
          >
            {{ ramp.name }}
          </p>
          <div class="flex flex-wrap gap-1">
            <div
              v-for="step in ramp.steps"
              :key="step"
              class="flex flex-col gap-1"
            >
              <span
                ref="primitiveEls"
                :data-primitive="`${ramp.name}-${step}`"
                class="block w-16 h-12 rounded-8 border border-border-default"
                :style="{ backgroundColor: `var(--${ramp.name}-${step})` }"
              />
              <span class="text-s-11 font-mono text-text-muted">{{
                step
              }}</span>
              <span class="text-s-11 font-mono text-text-placeholder">
                {{ primitiveValues[`${ramp.name}-${step}`] ?? '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ---------- Side-by-side component preview ---------- -->
    <section class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-s-24 font-bold">In context</h2>
        <p class="text-s-14 text-text-subtle">
          The same markup rendered in both themes.
        </p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="mode in ['light', 'dark'] as const"
          :key="mode"
          :data-theme="mode"
          class="bg-background-default rounded-16 p-5 flex flex-col gap-4 border border-border-default"
        >
          <p
            class="text-s-11 font-bold uppercase tracking-sp-06 text-text-subtle"
          >
            {{ mode }}
          </p>
          <div
            class="bg-background-alternative rounded-12 p-4 shadow-container flex flex-col gap-3"
          >
            <p class="text-s-17 font-medium text-text-default">
              Surface with primary text
            </p>
            <p class="text-s-14 text-text-subtle">
              Subtle text for secondary copy, then
              <span class="text-text-muted">muted</span> for tertiary, then
              <span class="text-text-placeholder">placeholder</span>.
            </p>
            <div class="h-px bg-border-default" />
            <div class="flex flex-wrap gap-2">
              <button
                class="bg-background-brand text-text-on-brand rounded-full px-4 py-2 text-s-14 font-medium"
              >
                Brand
              </button>
              <button
                class="bg-background-brand-subtle text-text-brand rounded-full px-4 py-2 text-s-14 font-medium"
              >
                Brand subtle
              </button>
              <button
                class="bg-background-contrast-default text-text-inverted rounded-full px-4 py-2 text-s-14 font-medium"
              >
                Contrast
              </button>
              <button
                class="bg-background-default-hover text-text-default rounded-full px-4 py-2 text-s-14 font-medium"
              >
                Neutral
              </button>
              <button
                class="bg-background-disabled text-text-disabled rounded-full px-4 py-2 text-s-14 font-medium"
              >
                Disabled
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                class="bg-background-success-subtle text-text-success rounded-full px-3 py-1 text-s-12 font-medium"
                >Success</span
              >
              <span
                class="bg-background-warning-subtle text-text-warning rounded-full px-3 py-1 text-s-12 font-medium"
                >Warning</span
              >
              <span
                class="bg-background-error-subtle text-text-error rounded-full px-3 py-1 text-s-12 font-medium"
                >Error</span
              >
              <span
                class="bg-background-info-subtle text-text-info rounded-full px-3 py-1 text-s-12 font-medium"
                >Info</span
              >
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="d in DECORATIVE"
                :key="d.cls"
                class="w-8 h-8 rounded-full"
                :class="d.cls"
                :title="d.name"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

/**
 * Colour reference page (/dev/colors).
 *
 * Tailwind's scanner reads source text, so a class name built by string
 * interpolation is never found. The semantic swatch classes below are written
 * out as literals for that reason — do not refactor them into template
 * strings. That also makes this page a build-time proof that every semantic
 * utility actually generates.
 *
 * Primitives are the exception: they are plain custom properties rather than
 * `@theme` entries, so no utility exists for them and nothing tree-shakes
 * them. Those swatches bind `var(--<ramp>-<step>)` directly.
 *
 * Colour VALUES are never written here; they are read back off the rendered
 * swatches, which keeps this page honest about what main.css actually emits.
 */

type SemanticToken = {
  name: string
  token: string
  swatch: string
  group: string
  alias: string
  onSurface?: boolean
}

/** One entry per published Figma colour variable, in Figma's own order. */
const SEMANTIC: SemanticToken[] = [
  {
    name: 'background/default',
    token: 'background-default',
    swatch: 'bg-background-default',
    group: 'background · neutral surfaces',
    alias: 'neutral/100',
  },
  {
    name: 'background/default-hover',
    token: 'background-default-hover',
    swatch: 'bg-background-default-hover',
    group: 'background · neutral surfaces',
    alias: 'neutral/200',
  },
  {
    name: 'background/default-pressed',
    token: 'background-default-pressed',
    swatch: 'bg-background-default-pressed',
    group: 'background · neutral surfaces',
    alias: 'neutral/300',
  },
  {
    name: 'background/alternative',
    token: 'background-alternative',
    swatch: 'bg-background-alternative',
    group: 'background · neutral surfaces',
    alias: 'neutral/white',
  },
  {
    name: 'background/alternative-hover',
    token: 'background-alternative-hover',
    swatch: 'bg-background-alternative-hover',
    group: 'background · neutral surfaces',
    alias: 'neutral/150',
  },
  {
    name: 'background/alternative-pressed',
    token: 'background-alternative-pressed',
    swatch: 'bg-background-alternative-pressed',
    group: 'background · neutral surfaces',
    alias: 'neutral/200',
  },
  {
    name: 'background/toggle',
    token: 'background-toggle',
    swatch: 'bg-background-toggle',
    group: 'background · neutral surfaces',
    alias: 'neutral/300',
  },
  {
    name: 'background/formfield',
    token: 'background-formfield',
    swatch: 'bg-background-formfield',
    group: 'background · neutral surfaces',
    alias: 'neutral/100',
  },
  {
    name: 'background/formfield-hover',
    token: 'background-formfield-hover',
    swatch: 'bg-background-formfield-hover',
    group: 'background · neutral surfaces',
    alias: 'neutral/200',
  },
  {
    name: 'background/skeleton',
    token: 'background-skeleton',
    swatch: 'bg-background-skeleton',
    group: 'background · neutral surfaces',
    alias: 'neutral/200',
  },
  {
    name: 'background/disabled',
    token: 'background-disabled',
    swatch: 'bg-background-disabled',
    group: 'background · neutral surfaces',
    alias: 'neutral/100',
  },
  {
    name: 'background/default-selected',
    token: 'background-default-selected',
    swatch: 'bg-background-default-selected',
    group: 'background · neutral surfaces',
    alias: 'neutral/250',
  },
  {
    name: 'background/alternative-selected',
    token: 'background-alternative-selected',
    swatch: 'bg-background-alternative-selected',
    group: 'background · neutral surfaces',
    alias: 'neutral/150',
  },
  {
    name: 'background/contrast-default',
    token: 'background-contrast-default',
    swatch: 'bg-background-contrast-default',
    group: 'background · contrast',
    alias: 'neutral/800',
  },
  {
    name: 'background/contrast-hover',
    token: 'background-contrast-hover',
    swatch: 'bg-background-contrast-hover',
    group: 'background · contrast',
    alias: 'neutral/750',
  },
  {
    name: 'background/contrast-pressed',
    token: 'background-contrast-pressed',
    swatch: 'bg-background-contrast-pressed',
    group: 'background · contrast',
    alias: 'neutral/650',
  },
  {
    name: 'background/contrast-disabled',
    token: 'background-contrast-disabled',
    swatch: 'bg-background-contrast-disabled',
    group: 'background · contrast',
    alias: 'neutral/900',
  },
  {
    name: 'background/brand',
    token: 'background-brand',
    swatch: 'bg-background-brand',
    group: 'background · brand',
    alias: 'brand/700',
  },
  {
    name: 'background/brand-hover',
    token: 'background-brand-hover',
    swatch: 'bg-background-brand-hover',
    group: 'background · brand',
    alias: 'brand/800',
  },
  {
    name: 'background/brand-pressed',
    token: 'background-brand-pressed',
    swatch: 'bg-background-brand-pressed',
    group: 'background · brand',
    alias: 'brand/900',
  },
  {
    name: 'background/brand-disabled',
    token: 'background-brand-disabled',
    swatch: 'bg-background-brand-disabled',
    group: 'background · brand',
    alias: 'brand/200',
  },
  {
    name: 'background/brand-subtle',
    token: 'background-brand-subtle',
    swatch: 'bg-background-brand-subtle',
    group: 'background · brand',
    alias: 'brand/75',
  },
  {
    name: 'background/brand-subtle-hover',
    token: 'background-brand-subtle-hover',
    swatch: 'bg-background-brand-subtle-hover',
    group: 'background · brand',
    alias: 'brand/100',
  },
  {
    name: 'background/brand-subtle-pressed',
    token: 'background-brand-subtle-pressed',
    swatch: 'bg-background-brand-subtle-pressed',
    group: 'background · brand',
    alias: 'brand/200',
  },
  {
    name: 'background/loading-track',
    token: 'background-loading-track',
    swatch: 'bg-background-loading-track',
    group: 'background · brand',
    alias: 'brand/200',
  },
  {
    name: 'background/error',
    token: 'background-error',
    swatch: 'bg-background-error',
    group: 'background · status',
    alias: 'red/600',
  },
  {
    name: 'background/error-hover',
    token: 'background-error-hover',
    swatch: 'bg-background-error-hover',
    group: 'background · status',
    alias: 'red/700',
  },
  {
    name: 'background/error-pressed',
    token: 'background-error-pressed',
    swatch: 'bg-background-error-pressed',
    group: 'background · status',
    alias: 'red/800',
  },
  {
    name: 'background/error-subtle',
    token: 'background-error-subtle',
    swatch: 'bg-background-error-subtle',
    group: 'background · status',
    alias: 'red/75',
  },
  {
    name: 'background/error-subtle-hover',
    token: 'background-error-subtle-hover',
    swatch: 'bg-background-error-subtle-hover',
    group: 'background · status',
    alias: 'red/100',
  },
  {
    name: 'background/error-subtle-pressed',
    token: 'background-error-subtle-pressed',
    swatch: 'bg-background-error-subtle-pressed',
    group: 'background · status',
    alias: 'red/200',
  },
  {
    name: 'background/loading-track-danger',
    token: 'background-loading-track-danger',
    swatch: 'bg-background-loading-track-danger',
    group: 'background · status',
    alias: 'red/400',
  },
  {
    name: 'background/success',
    token: 'background-success',
    swatch: 'bg-background-success',
    group: 'background · status',
    alias: 'green/600',
  },
  {
    name: 'background/success-subtle',
    token: 'background-success-subtle',
    swatch: 'bg-background-success-subtle',
    group: 'background · status',
    alias: 'green/125',
  },
  {
    name: 'background/success-subtle-hover',
    token: 'background-success-subtle-hover',
    swatch: 'bg-background-success-subtle-hover',
    group: 'background · status',
    alias: 'green/150',
  },
  {
    name: 'background/warning',
    token: 'background-warning',
    swatch: 'bg-background-warning',
    group: 'background · status',
    alias: 'orange/600',
  },
  {
    name: 'background/warning-subtle',
    token: 'background-warning-subtle',
    swatch: 'bg-background-warning-subtle',
    group: 'background · status',
    alias: 'orange/75',
  },
  {
    name: 'background/warning-subtle-hover',
    token: 'background-warning-subtle-hover',
    swatch: 'bg-background-warning-subtle-hover',
    group: 'background · status',
    alias: 'orange/100',
  },
  {
    name: 'background/info',
    token: 'background-info',
    swatch: 'bg-background-info',
    group: 'background · status',
    alias: 'neutral/900',
  },
  {
    name: 'background/info-subtle',
    token: 'background-info-subtle',
    swatch: 'bg-background-info-subtle',
    group: 'background · status',
    alias: 'brand/75',
  },
  {
    name: 'background/overlay-subtle',
    token: 'background-overlay-subtle',
    swatch: 'bg-background-overlay-subtle',
    group: 'background · overlay',
    alias: 'neutral/black',
  },
  {
    name: 'background/overlay-inverted',
    token: 'background-overlay-inverted',
    swatch: 'bg-background-overlay-inverted',
    group: 'background · overlay',
    alias: 'neutral/white',
  },
  {
    name: 'background/decorative-blue',
    token: 'background-decorative-blue',
    swatch: 'bg-background-decorative-blue',
    group: 'background · decorative',
    alias: 'brand/500',
  },
  {
    name: 'background/decorative-blue-strong',
    token: 'background-decorative-blue-strong',
    swatch: 'bg-background-decorative-blue-strong',
    group: 'background · decorative',
    alias: 'brand/700',
  },
  {
    name: 'background/decorative-purple',
    token: 'background-decorative-purple',
    swatch: 'bg-background-decorative-purple',
    group: 'background · decorative',
    alias: 'purple/500',
  },
  {
    name: 'background/decorative-purple-strong',
    token: 'background-decorative-purple-strong',
    swatch: 'bg-background-decorative-purple-strong',
    group: 'background · decorative',
    alias: 'purple/700',
  },
  {
    name: 'background/decorative-violet',
    token: 'background-decorative-violet',
    swatch: 'bg-background-decorative-violet',
    group: 'background · decorative',
    alias: 'violet/400',
  },
  {
    name: 'background/decorative-violet-strong',
    token: 'background-decorative-violet-strong',
    swatch: 'bg-background-decorative-violet-strong',
    group: 'background · decorative',
    alias: 'violet/700',
  },
  {
    name: 'background/decorative-pink',
    token: 'background-decorative-pink',
    swatch: 'bg-background-decorative-pink',
    group: 'background · decorative',
    alias: 'red/500',
  },
  {
    name: 'background/decorative-pink-strong',
    token: 'background-decorative-pink-strong',
    swatch: 'bg-background-decorative-pink-strong',
    group: 'background · decorative',
    alias: 'red/700',
  },
  {
    name: 'background/decorative-orange',
    token: 'background-decorative-orange',
    swatch: 'bg-background-decorative-orange',
    group: 'background · decorative',
    alias: 'orange/500',
  },
  {
    name: 'background/decorative-orange-strong',
    token: 'background-decorative-orange-strong',
    swatch: 'bg-background-decorative-orange-strong',
    group: 'background · decorative',
    alias: 'orange/600',
  },
  {
    name: 'background/decorative-green',
    token: 'background-decorative-green',
    swatch: 'bg-background-decorative-green',
    group: 'background · decorative',
    alias: 'green/600',
  },
  {
    name: 'background/decorative-green-strong',
    token: 'background-decorative-green-strong',
    swatch: 'bg-background-decorative-green-strong',
    group: 'background · decorative',
    alias: 'green/700',
  },
  {
    name: 'background/decorative-neutral',
    token: 'background-decorative-neutral',
    swatch: 'bg-background-decorative-neutral',
    group: 'background · decorative',
    alias: 'neutral/500',
  },
  {
    name: 'text/default',
    token: 'text-default',
    swatch: 'bg-text-default',
    group: 'text',
    alias: 'neutral/black',
    onSurface: true,
  },
  {
    name: 'text/subtle',
    token: 'text-subtle',
    swatch: 'bg-text-subtle',
    group: 'text',
    alias: 'neutral/600',
    onSurface: true,
  },
  {
    name: 'text/muted',
    token: 'text-muted',
    swatch: 'bg-text-muted',
    group: 'text',
    alias: 'neutral/500',
    onSurface: true,
  },
  {
    name: 'text/placeholder',
    token: 'text-placeholder',
    swatch: 'bg-text-placeholder',
    group: 'text',
    alias: 'neutral/400',
    onSurface: true,
  },
  {
    name: 'text/disabled',
    token: 'text-disabled',
    swatch: 'bg-text-disabled',
    group: 'text',
    alias: 'neutral/400',
    onSurface: true,
  },
  {
    name: 'text/inverted',
    token: 'text-inverted',
    swatch: 'bg-text-inverted',
    group: 'text',
    alias: 'neutral/white',
  },
  {
    name: 'text/inverted-subtle',
    token: 'text-inverted-subtle',
    swatch: 'bg-text-inverted-subtle',
    group: 'text',
    alias: 'neutral/375',
  },
  {
    name: 'text/brand',
    token: 'text-brand',
    swatch: 'bg-text-brand',
    group: 'text',
    alias: 'brand/700',
    onSurface: true,
  },
  {
    name: 'text/brand-hover',
    token: 'text-brand-hover',
    swatch: 'bg-text-brand-hover',
    group: 'text',
    alias: 'brand/800',
    onSurface: true,
  },
  {
    name: 'text/brand-pressed',
    token: 'text-brand-pressed',
    swatch: 'bg-text-brand-pressed',
    group: 'text',
    alias: 'brand/900',
    onSurface: true,
  },
  {
    name: 'text/error',
    token: 'text-error',
    swatch: 'bg-text-error',
    group: 'text',
    alias: 'red/600',
    onSurface: true,
  },
  {
    name: 'text/success',
    token: 'text-success',
    swatch: 'bg-text-success',
    group: 'text',
    alias: 'green/600',
    onSurface: true,
  },
  {
    name: 'text/warning',
    token: 'text-warning',
    swatch: 'bg-text-warning',
    group: 'text',
    alias: 'orange/600',
    onSurface: true,
  },
  {
    name: 'text/info',
    token: 'text-info',
    swatch: 'bg-text-info',
    group: 'text',
    alias: 'brand/700',
    onSurface: true,
  },
  {
    name: 'text/on-brand',
    token: 'text-on-brand',
    swatch: 'bg-text-on-brand',
    group: 'text',
    alias: 'neutral/white',
  },
  {
    name: 'text/on-error',
    token: 'text-on-error',
    swatch: 'bg-text-on-error',
    group: 'text',
    alias: 'neutral/white',
  },
  {
    name: 'text/on-success',
    token: 'text-on-success',
    swatch: 'bg-text-on-success',
    group: 'text',
    alias: 'neutral/white',
  },
  {
    name: 'text/on-warning',
    token: 'text-on-warning',
    swatch: 'bg-text-on-warning',
    group: 'text',
    alias: 'neutral/black',
  },
  {
    name: 'icon/default',
    token: 'icon-default',
    swatch: 'bg-icon-default',
    group: 'icon',
    alias: 'neutral/black',
    onSurface: true,
  },
  {
    name: 'icon/subtle',
    token: 'icon-subtle',
    swatch: 'bg-icon-subtle',
    group: 'icon',
    alias: 'neutral/500',
    onSurface: true,
  },
  {
    name: 'icon/disabled',
    token: 'icon-disabled',
    swatch: 'bg-icon-disabled',
    group: 'icon',
    alias: 'neutral/400',
    onSurface: true,
  },
  {
    name: 'icon/inverted',
    token: 'icon-inverted',
    swatch: 'bg-icon-inverted',
    group: 'icon',
    alias: 'neutral/white',
  },
  {
    name: 'icon/brand',
    token: 'icon-brand',
    swatch: 'bg-icon-brand',
    group: 'icon',
    alias: 'brand/700',
    onSurface: true,
  },
  {
    name: 'icon/error',
    token: 'icon-error',
    swatch: 'bg-icon-error',
    group: 'icon',
    alias: 'red/600',
    onSurface: true,
  },
  {
    name: 'icon/success',
    token: 'icon-success',
    swatch: 'bg-icon-success',
    group: 'icon',
    alias: 'green/600',
    onSurface: true,
  },
  {
    name: 'icon/warning',
    token: 'icon-warning',
    swatch: 'bg-icon-warning',
    group: 'icon',
    alias: 'orange/600',
    onSurface: true,
  },
  {
    name: 'border/subtle',
    token: 'border-subtle',
    swatch: 'bg-border-subtle',
    group: 'border',
    alias: 'neutral/100',
  },
  {
    name: 'border/default',
    token: 'border-default',
    swatch: 'bg-border-default',
    group: 'border',
    alias: 'neutral/200',
  },
  {
    name: 'border/strong',
    token: 'border-strong',
    swatch: 'bg-border-strong',
    group: 'border',
    alias: 'neutral/300',
  },
  {
    name: 'border/hover',
    token: 'border-hover',
    swatch: 'bg-border-hover',
    group: 'border',
    alias: 'neutral/400',
  },
  {
    name: 'border/pressed',
    token: 'border-pressed',
    swatch: 'bg-border-pressed',
    group: 'border',
    alias: 'neutral/500',
  },
  {
    name: 'border/selected',
    token: 'border-selected',
    swatch: 'bg-border-selected',
    group: 'border',
    alias: 'neutral/black',
  },
  {
    name: 'border/focus',
    token: 'border-focus',
    swatch: 'bg-border-focus',
    group: 'border',
    alias: 'brand/600',
  },
  {
    name: 'border/brand',
    token: 'border-brand',
    swatch: 'bg-border-brand',
    group: 'border',
    alias: 'brand/700',
  },
  {
    name: 'border/error',
    token: 'border-error',
    swatch: 'bg-border-error',
    group: 'border',
    alias: 'red/600',
  },
  {
    name: 'border/error-subtle',
    token: 'border-error-subtle',
    swatch: 'bg-border-error-subtle',
    group: 'border',
    alias: 'red/200',
  },
  {
    name: 'border/success',
    token: 'border-success',
    swatch: 'bg-border-success',
    group: 'border',
    alias: 'green/600',
  },
  {
    name: 'border/warning',
    token: 'border-warning',
    swatch: 'bg-border-warning',
    group: 'border',
    alias: 'orange/600',
  },
  {
    name: 'border/disabled',
    token: 'border-disabled',
    swatch: 'bg-border-disabled',
    group: 'border',
    alias: 'neutral/200',
  },
  {
    name: 'border/inverted',
    token: 'border-inverted',
    swatch: 'bg-border-inverted',
    group: 'border',
    alias: 'neutral/750',
  },
  {
    name: 'transparent/brand',
    token: 'transparent-brand',
    swatch: 'bg-transparent-brand',
    group: 'border',
    alias: 'brand/600 · 30%',
  },
]

const GROUPS = [...new Set(SEMANTIC.map(t => t.group))]
const byGroup = (group: string) => SEMANTIC.filter(t => t.group === group)

/** Steps run dark -> light to match how the ramps read in Figma. */
const RAMPS = [
  {
    name: 'brand',
    steps: [
      '950',
      '900',
      '800',
      '700',
      '600',
      '500',
      '400',
      '300',
      '200',
      '100',
      '75',
      '50',
    ],
  },
  {
    name: 'purple',
    steps: [
      '950',
      '900',
      '800',
      '700',
      '600',
      '500',
      '400',
      '300',
      '200',
      '100',
      '50',
    ],
  },
  {
    name: 'violet',
    steps: [
      '950',
      '900',
      '800',
      '700',
      '600',
      '500',
      '400',
      '300',
      '200',
      '100',
      '50',
    ],
  },
  {
    name: 'red',
    steps: [
      '950',
      '900',
      '800',
      '700',
      '600',
      '500',
      '400',
      '300',
      '200',
      '100',
      '75',
      '50',
    ],
  },
  {
    name: 'green',
    steps: [
      '950',
      '900',
      '800',
      '700',
      '600',
      '500',
      '400',
      '300',
      '200',
      '150',
      '125',
      '100',
      '50',
    ],
  },
  {
    name: 'orange',
    steps: [
      '950',
      '900',
      '800',
      '700',
      '600',
      '500',
      '400',
      '300',
      '200',
      '100',
      '75',
      '50',
    ],
  },
]

/** Category colours carry no meaning, so they only need a visual check. */
const DECORATIVE = SEMANTIC.filter(t =>
  t.name.startsWith('background/decorative-'),
).map(t => ({ name: t.name, cls: t.swatch }))

const resolved = reactive<Record<'light' | 'dark', Record<string, string>>>({
  light: {},
  dark: {},
})
const contrast = reactive<Record<'light' | 'dark', Record<string, string>>>({
  light: {},
  dark: {},
})
const primitiveValues = ref<Record<string, string>>({})
const primitiveEls = ref<HTMLElement[]>([])

const toHex = (rgb: string): string => {
  const parts = rgb.match(/\d+(\.\d+)?/g)
  if (!parts || parts.length < 3) return rgb
  const [r, g, b] = parts.map(Number)
  const hex = `#${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')}`
  // Surface any alpha rather than silently dropping it.
  const alpha = parts[3] !== undefined ? Number(parts[3]) : 1
  return alpha < 1 ? `${hex} / ${alpha}` : hex
}

/** WCAG 2.1 relative luminance. */
const luminance = (rgb: string): number => {
  const parts = rgb.match(/\d+(\.\d+)?/g)
  if (!parts) return 0
  const [r, g, b] = parts.slice(0, 3).map(n => {
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

    const surface = read('bg-background-alternative')
    for (const token of SEMANTIC) {
      const raw = read(token.swatch)
      resolved[mode][token.name] = toHex(raw)
      if (token.onSurface) {
        const r = ratio(raw, surface)
        const rating =
          r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'fail'
        contrast[mode][token.name] = `${r.toFixed(1)}:1 ${rating}`
      }
    }
    document.body.removeChild(probe)
  }

  // Primitives are theme-independent, so read them straight off the DOM.
  const values: Record<string, string> = {}
  for (const el of primitiveEls.value) {
    const key = el.dataset.primitive
    if (key) values[key] = toHex(getComputedStyle(el).backgroundColor)
  }
  primitiveValues.value = values
}

onMounted(measure)
</script>
