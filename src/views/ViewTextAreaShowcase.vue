<script setup lang="ts">
// Preview for the design-library Text Area (MEW-2442) at /dev/text-area.
// Figma component set 3094:65088: each style on the surface it is meant for,
// then the boolean props and the Verify Message example (3427:280). Hover a
// field for Hover; Tab in for Focus; click and type for Active.
import { reactive, ref } from 'vue'
import AppTextArea from '@components/text_area/AppTextArea.vue'
import AppInput from '@components/AppInput.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import { INPUT_SURFACES } from '@components/inputSizes'

const PAGE = {
  default: 'bg-background-alternative',
  alternative: 'bg-background-default',
} as const

const VARIANTS = [
  { key: 'empty', caption: 'Filled=false', props: {}, value: '' },
  { key: 'filled', caption: 'Filled=true', props: {}, value: 'User input' },
  {
    key: 'empty-error',
    caption: 'Filled=false, Error=true',
    props: { errorMessage: 'Error message' },
    value: '',
  },
  {
    key: 'filled-error',
    caption: 'Filled=true, Error=true',
    props: { errorMessage: 'Error message' },
    value: 'User input',
  },
  {
    key: 'empty-disabled',
    caption: 'Disabled, Filled=false',
    props: { disabled: true },
    value: '',
  },
  {
    key: 'filled-disabled',
    caption: 'Disabled, Filled=true',
    props: { disabled: true },
    value: 'User input',
  },
]

const models = reactive<Record<string, string>>({})
for (const surface of INPUT_SURFACES)
  for (const v of VARIANTS) models[`${surface}-${v.key}`] = v.value

const withMessage = ref('')
const withLabel = ref('Hello MEW')
const withAction = ref('0x9a2f…signature')
const lastAction = ref('')

const verifyMessage = ref('')
const verifyAddress = ref('')
const verifySignature = ref('')
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Text Area</h1>
      <p class="text-text-sm text-text-subtle">
        Multi-line text field, sharing the label, placeholder and feedback
        pattern used by Input.
      </p>
    </header>

    <section
      v-for="surface in INPUT_SURFACES"
      :key="surface"
      class="flex flex-col gap-4"
    >
      <h2 class="text-label-base">Style: {{ surface }}</h2>
      <div
        class="grid grid-cols-1 gap-6 rounded-12 border border-border-default p-6 md:grid-cols-2"
        :class="PAGE[surface]"
      >
        <div v-for="v in VARIANTS" :key="v.key">
          <p class="mb-1 text-text-xs text-text-muted">{{ v.caption }}</p>
          <AppTextArea
            v-model="models[`${surface}-${v.key}`]"
            :surface="surface"
            placeholder="Placeholder"
            v-bind="v.props"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Props</h2>
      <div
        class="grid grid-cols-1 gap-6 rounded-12 border border-border-default bg-background-alternative p-6 md:grid-cols-2"
      >
        <div>
          <p class="mb-1 text-text-xs text-text-muted">message</p>
          <AppTextArea
            v-model="withMessage"
            placeholder="Placeholder"
            message="Message"
          />
        </div>
        <div>
          <p class="mb-1 text-text-xs text-text-muted">
            label (floats once filled)
          </p>
          <AppTextArea
            v-model="withLabel"
            label="Message to sign"
            placeholder="Enter a message"
          />
        </div>
        <div>
          <p class="mb-1 text-text-xs text-text-muted">
            action-icon="copy" — last action: {{ lastAction || '—' }}
          </p>
          <AppTextArea
            v-model="withAction"
            placeholder="Placeholder"
            action-icon="copy"
            action-label="Copy"
            @action="lastAction = $event"
          />
        </div>
        <div>
          <p class="mb-1 text-text-xs text-text-muted">action-icon, disabled</p>
          <AppTextArea
            v-model="withAction"
            placeholder="Placeholder"
            action-icon="copy"
            action-label="Copy"
            disabled
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Example — Verify Message</h2>
      <div class="flex justify-center rounded-12 bg-background-default p-10">
        <div
          class="flex w-full max-w-120 flex-col gap-6 rounded-24 bg-background-alternative p-8"
        >
          <p class="text-heading-xl">Verify Message</p>
          <AppTextArea
            v-model="verifyMessage"
            placeholder="Enter the message to verify"
            height-class="h-[220px]"
          />
          <AppInput v-model="verifyAddress" label="Enter Address" />
          <AppTextArea
            v-model="verifySignature"
            placeholder="Enter the signature to verify"
          />
          <AppBaseButton disabled>Verify Message</AppBaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
