<script setup lang="ts">
// Preview for the Toast design-library component (MEW-1975) at /dev/toast.
// Matches Figma component set 2680:45751; the live buttons go through the real
// toast store, so they show up in the app's toast stack (bottom left).
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppToast from '@/components/toast/AppToast.vue'
import { TOAST_TYPES, TOAST_TYPES_WITH_BUTTON } from '@/components/toast/types'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import ethIcon from '@/assets/icons/tokens/eth.svg'

const ETH_ASSET = { symbol: 'ETH', url: ethIcon }
const LONG_DESCRIPTION =
  'Your order was split across several routes, so the received amount can differ slightly from the quote. Check the activity tab for every fill.'

const toastStore = useToastStore()

const STORE_TYPES = [
  ToastType.Success,
  ToastType.Error,
  ToastType.Warning,
  ToastType.Info,
]

const fireStoreType = (type: ToastType) =>
  toastStore.addToastMessage({
    type,
    text: `${type} toast`,
    textSecondary: 'Fired through the toast store',
  })

const PROCESSING_ID = 'dev-toast-processing'

const fireProcessingThatCompletes = () => {
  toastStore.addToastMessage({
    id: PROCESSING_ID,
    text: 'Processing trade',
    textSecondary: 'This can take a few seconds',
    isInfinite: true,
    tradeStatus: { kind: 'processing' },
  })
  setTimeout(() => {
    toastStore.removeToastById(PROCESSING_ID)
    toastStore.addToastMessage({
      text: 'Trade completed',
      textSecondary: 'You received 0.5 ETH',
      tradeStatus: { kind: 'completed', toSymbol: 'ETH', toTokenIcon: ethIcon },
      link: { title: 'View in explorer', url: 'https://etherscan.io' },
    })
  }, 2000)
}

const fireSticky = () =>
  toastStore.addToastMessage({
    type: ToastType.Warning,
    text: 'Sticky warning',
    textSecondary: 'Stays until you close it',
    isInfinite: true,
  })
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Toast</h1>
      <p class="text-text-sm text-text-subtle">
        Temporary, dismissible message that surfaces the status of a background
        action (processing, success, error, warning, or info).
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Type</h2>
      <div
        class="grid gap-6 rounded-12 border border-border-default bg-background-default p-6 md:grid-cols-2"
      >
        <div
          v-for="type in TOAST_TYPES"
          :key="type"
          class="flex flex-col gap-2"
        >
          <p class="text-text-xs text-text-subtle">{{ type }}</p>
          <AppToast
            :type="type"
            title="Title"
            description="Information"
            :asset="type === 'transaction-completed' ? ETH_ASSET : undefined"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Show Button</h2>
      <div
        class="grid gap-6 rounded-12 border border-border-default bg-background-default p-6 md:grid-cols-2"
      >
        <div
          v-for="type in TOAST_TYPES_WITH_BUTTON"
          :key="type"
          class="flex flex-col gap-2"
        >
          <p class="text-text-xs text-text-subtle">{{ type }}</p>
          <AppToast
            :type="type"
            title="Title"
            description="Information"
            button-label="Button"
            :asset="type === 'transaction-completed' ? ETH_ASSET : undefined"
          />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Show Slot and long description</h2>
      <div
        class="flex flex-col gap-6 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppToast type="info" title="Title" description="Information">
          <p class="text-text-xs text-text-inverted">Content slot</p>
        </AppToast>
        <AppToast
          type="success"
          title="Order filled"
          :description="LONG_DESCRIPTION"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live (through the toast store)</h2>
      <div
        class="flex flex-wrap gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppBaseButton
          v-for="type in STORE_TYPES"
          :key="type"
          size="small"
          @click="fireStoreType(type)"
        >
          {{ type }}
        </AppBaseButton>
        <AppBaseButton size="small" @click="fireProcessingThatCompletes">
          processing → completed (2s)
        </AppBaseButton>
        <AppBaseButton size="small" @click="fireSticky"> sticky </AppBaseButton>
      </div>
    </section>
  </div>
</template>
