<script setup lang="ts">
// Dev-only preview for AppInput, AppTextField and AppSearchInput.
// Route is registered only when import.meta.env.DEV — see routesDefault.ts.
// Visit https://localhost:8080/input-preview in dev.
//
// Renders every AppInput axis (size × surface × state) so the rebuild can be
// diffed against Figma: fixed 56/40 height across states, focus-only error
// ring, Large float-label vs Small no-label, 80/64 error height, disabled.
import { reactive } from 'vue'
import AppInput from '@components/AppInput.vue'
import AppTextField from '@components/AppTextField.vue'
import AppSearchInput from '@components/AppSearchInput.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { INPUT_SIZES } from '@components/inputSizes'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { ClipboardIcon } from '@heroicons/vue/24/outline'

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

const textFieldModel = reactive({
  default: '',
  alternative: 'A signed message',
})
const searchModel = reactive({ default: '', alternative: '' })
</script>

<template>
  <div class="p-6 md:p-10 bg-app-background min-h-screen space-y-12">
    <header>
      <h1 class="text-s-28 font-semibold">AppInput — design library</h1>
      <p class="text-s-14 text-grey-50 mt-1">
        Hover / focus the Default-row fields to see the border ring. The error
        ring is focus-only; blurred errored fields keep their normal border and
        show the feedback row.
      </p>
    </header>

    <section
      v-for="surface in surfaces"
      :key="surface"
      :class="[
        'p-6 rounded-20 space-y-8',
        surface === 'alternative'
          ? 'bg-white border border-grey-10'
          : 'bg-app-background border border-dashed border-grey-10',
      ]"
    >
      <h2 class="text-s-20 font-semibold capitalize">
        surface = {{ surface }}
        <span class="text-s-13 font-normal text-grey-50">
          ({{
            surface === 'alternative'
              ? 'white — cards & dialogs'
              : 'grey — app background'
          }})
        </span>
      </h2>

      <div v-for="size in sizes" :key="size" class="space-y-4">
        <h3 class="text-s-15 text-grey-50 capitalize">size = {{ size }}</h3>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5"
        >
          <div v-for="v in variants" :key="v.key">
            <p class="text-s-12 text-grey-50 mb-1">{{ v.caption }}</p>
            <AppInput
              v-model="models[`${surface}-${size}-${v.key}`]"
              :size="size"
              :surface="surface"
              label="Recipient"
              placeholder="Address or ENS"
              v-bind="v.props"
            >
              <template v-if="v.leading" #leading>
                <UserCircleIcon class="w-full h-full text-grey-subtle" />
              </template>
              <template v-if="v.trailing" #trailing>
                <AppBtnIcon label="Paste">
                  <ClipboardIcon class="w-5 h-5 text-primary" />
                </AppBtnIcon>
              </template>
            </AppInput>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-s-20 font-semibold">AppTextField</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="p-6 rounded-20 bg-app-background border border-dashed border-grey-10"
        >
          <p class="text-s-12 text-grey-50 mb-2">surface = default</p>
          <AppTextField
            v-model="textFieldModel.default"
            placeholder="Message to sign"
          />
        </div>
        <div class="p-6 rounded-20 bg-white border border-grey-10">
          <p class="text-s-12 text-grey-50 mb-2">surface = alternative</p>
          <AppTextField
            v-model="textFieldModel.alternative"
            surface="alternative"
            placeholder="Message to sign"
          />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-s-20 font-semibold">AppSearchInput</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="p-6 rounded-20 bg-app-background border border-dashed border-grey-10"
        >
          <p class="text-s-12 text-grey-50 mb-2">on grey app bg</p>
          <AppSearchInput v-model="searchModel.default" />
        </div>
        <div class="p-6 rounded-20 bg-white border border-grey-10">
          <p class="text-s-12 text-grey-50 mb-2">on white card</p>
          <AppSearchInput v-model="searchModel.alternative" />
        </div>
      </div>
    </section>
  </div>
</template>
