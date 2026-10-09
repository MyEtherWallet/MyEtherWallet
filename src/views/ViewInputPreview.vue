<script setup lang="ts">
// Component preview for AppInput (Text area and Searchbar have their own pages).
// Reachable at /dev/input via the design-library shell (registered in routesDefault.ts).
//
// Renders every AppInput axis (size × surface × state) so the rebuild can be
// diffed against Figma: fixed 56/40 height across states, focus-only error
// ring, Large float-label vs Small no-label, 80/64 error height, disabled.
import { reactive } from 'vue'
import AppInput from '@components/AppInput.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { INPUT_SIZES } from '@components/inputSizes'
import AppIcon from '@/components/icon/AppIcon.vue'

const sizes = INPUT_SIZES
const surfaces = ['default', 'alternative'] as const

type Variant = {
  key: string
  caption: string
  props: Record<string, unknown>
  value: string
  leading?: boolean
  trailing?: boolean
}

const variants: Variant[] = [
  { key: 'empty', caption: 'Default (empty)', props: {}, value: '' },
  { key: 'filled', caption: 'Filled', props: {}, value: 'vitalik.eth' },
  {
    key: 'error',
    caption: 'Error — focus to see ring',
    props: { errorMessage: 'Enter a valid address' },
    value: '0x123',
  },
  {
    key: 'required',
    caption: 'Required — blur while empty',
    props: { isRequired: true },
    value: '',
  },
  {
    key: 'disabled',
    caption: 'Disabled',
    props: { disabled: true },
    value: 'Read only',
  },
  {
    key: 'password',
    caption: 'Password (reveal + clear)',
    props: { type: 'password' },
    value: 'sup3rsecret',
  },
  {
    key: 'avatar',
    caption: 'Leading avatar',
    props: {},
    value: '0xAbc…9f2',
    leading: true,
  },
  {
    key: 'trailing',
    caption: 'Trailing slot action',
    props: {},
    value: '12.5',
    trailing: true,
  },
]

// One model per cell so every field is live (float label, clear, ring…).
const models = reactive<Record<string, string>>({})
for (const surface of surfaces)
  for (const size of sizes)
    for (const v of variants) models[`${surface}-${size}-${v.key}`] = v.value
</script>

<template>
  <div class="p-6 md:p-10 space-y-12">
    <header>
      <h1 class="text-s-28 font-semibold">AppInput — design library</h1>
      <p class="text-s-14 text-text-muted mt-1">
        Tab into a field to see the Focus ring (red when errored). Clicking in
        or typing is the Active state: caret only, no ring. Blurred errored
        fields keep their normal line and show the feedback row.
      </p>
    </header>

    <section
      v-for="surface in surfaces"
      :key="surface"
      :class="[
        'p-6 rounded-20 space-y-8',
        surface === 'alternative'
          ? 'bg-background-default border border-dashed border-border-default'
          : 'bg-white border border-border-default',
      ]"
    >
      <h2 class="text-s-20 font-semibold capitalize">
        surface = {{ surface }}
        <span class="text-s-13 font-normal text-text-muted">
          ({{
            surface === 'alternative'
              ? 'white + border — dialogs today, also for grey backgrounds'
              : 'grey fill — for white surfaces'
          }})
        </span>
      </h2>

      <div v-for="size in sizes" :key="size" class="space-y-4">
        <h3 class="text-s-15 text-text-muted capitalize">size = {{ size }}</h3>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5"
        >
          <div v-for="v in variants" :key="v.key">
            <p class="text-s-12 text-text-muted mb-1">{{ v.caption }}</p>
            <AppInput
              v-model="models[`${surface}-${size}-${v.key}`]"
              :size="size"
              :surface="surface"
              label="Recipient"
              placeholder="Address or ENS"
              v-bind="v.props"
            >
              <template v-if="v.leading" #leading>
                <AppIcon
                  name="user-circle"
                  variant="filled"
                  class="w-full h-full text-text-placeholder"
                />
              </template>
              <template v-if="v.trailing" #trailing>
                <AppBtnIcon label="Paste">
                  <AppIcon
                    name="clipboard"
                    size="s"
                    class="text-icon-default"
                  />
                </AppBtnIcon>
              </template>
            </AppInput>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
