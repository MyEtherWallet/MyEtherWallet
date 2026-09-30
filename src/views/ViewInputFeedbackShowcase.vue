<script setup lang="ts">
// Gallery for the Input feedback row (MEW-2402), reachable at
// /dev/input-feedback via the design-library shell — see routesDefault.ts.
// The four Figma types standalone (node 2564:1269), then the row under
// AppInput / AppTextField, including a long message that wraps.
import { ref } from 'vue'
import AppInput from '@/components/AppInput.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import { FEEDBACK_TYPES } from '@/components/input_feedback/types'

const LABEL = {
  error: 'Error message',
  success: 'Success message',
  warning: 'Warning message',
  text: 'Message',
} as const

const LONG =
  'This address has never received funds on this network. Double-check it before you send, transfers to the wrong address cannot be reversed.'

const address = ref('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
const amount = ref('12')
const name = ref('')
const message = ref('Hello MEW')
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-4xl mx-auto">
    <header class="flex flex-col gap-1">
      <h1 class="text-s-24 font-bold">Input feedback</h1>
      <p class="text-s-14 text-text-subtle">
        Status row below a form field. Type drives the icon and colour; Text is
        a plain helper with no icon.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Types</h2>
      <div
        class="flex flex-col gap-10 rounded-12 border border-border-default p-8"
      >
        <div class="w-85">
          <AppInputFeedback
            v-for="t in FEEDBACK_TYPES"
            :key="t"
            :type="t"
            :message="LABEL[t]"
            class="mb-6 last:mb-0"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Under AppInput</h2>
      <div
        class="grid sm:grid-cols-2 gap-6 rounded-12 border border-border-default p-8"
      >
        <AppInput
          v-model="address"
          label="Recipient"
          error-message="Invalid address"
        />
        <AppInput
          v-model="address"
          label="Recipient"
          :feedback="{ type: 'success', message: 'Address verified' }"
        />
        <AppInput
          v-model="amount"
          label="Amount"
          :feedback="{ type: 'warning', message: 'Low balance for gas' }"
        />
        <AppInput
          v-model="name"
          label="Nickname"
          :feedback="{ type: 'text', message: 'Only visible to you' }"
        />
        <AppInput
          v-model="address"
          label="Recipient"
          :feedback="{ type: 'warning', message: LONG }"
          class="sm:col-span-2"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Under AppTextField</h2>
      <div
        class="grid sm:grid-cols-2 gap-6 rounded-12 border border-border-default p-8"
      >
        <AppTextField
          v-model="message"
          placeholder="Message"
          error-message="Invalid signature"
        />
        <AppTextField
          v-model="message"
          placeholder="Message"
          :feedback="{ type: 'success', message: 'Signature verified' }"
        />
      </div>
    </section>
  </div>
</template>
