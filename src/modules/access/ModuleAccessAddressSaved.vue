<template>
  <app-dialog
    v-model:is-open="isOpen"
    persistent
    class="w-full sm:max-w-[400px] sm:mx-auto"
  >
    <template #title>
      <button
        data-test="address-saved-back"
        aria-label="back"
        class="absolute top-4 left-4 flex items-center justify-center size-8 rounded-full hoverNoBG"
        @click="onBack"
      >
        <chevron-left-icon class="w-5 h-5 text-black" />
      </button>
    </template>
    <template #content>
      <div class="flex flex-col items-center gap-6 px-6 pt-12 pb-6 text-center">
        <div
          class="size-16 rounded-32 bg-[#f5f5f5] flex items-center justify-center overflow-hidden shrink-0"
        >
          <img
            v-if="info?.walletIcon"
            :src="info.walletIcon"
            alt=""
            aria-hidden="true"
            class="size-[65%] object-contain"
          />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <h2 class="text-s-20 font-bold text-black leading-[22px] tracking-[-0.4px]">
            {{ titleLead }}<br />{{
              $t('multi_address.address_saved.title_suffix')
            }}
          </h2>
          <p class="text-s-14 text-[#575757] leading-[20px]">
            {{ $t('multi_address.address_saved.subtitle', { wallet: info?.walletName }) }}
          </p>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <!-- Hidden for now (MEW-1840): "Open <wallet>" CTA — no reliable API
               to open the extension popup (esp. BTC). Kept for quick re-enable. -->
          <button
            v-if="false"
            data-test="address-saved-open"
            class="h-12 w-full rounded-[24px] bg-primary text-white text-s-16 font-semibold flex items-center justify-center gap-2"
            @click="onOpenWallet"
          >
            {{ $t('multi_address.address_saved.open_wallet', { wallet: info?.walletName }) }}
            <arrow-top-right-on-square-icon class="w-5 h-5" />
          </button>
          <button
            data-test="address-saved-retry"
            class="h-12 w-full rounded-[24px] bg-[#e6e6e6] text-black text-s-16 font-semibold"
            @click="onTryAgain"
          >
            {{ $t('multi_address.address_saved.try_again') }}
          </button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  ChevronLeftIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import { useAccessStore } from '@/stores/accessStore'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { truncateAddress } from '@/utils/filters'

const accessStore = useAccessStore()
const { addressSavedInfo: info } = storeToRefs(accessStore)

// Title lead line. A saved account whose name was never customised defaults to
// its own truncated address, so repeating it in brackets is redundant — show
// just the truncated address in that case; otherwise "{name} ({truncated})".
const titleLead = computed<string>(() => {
  const address = info.value?.address ?? ''
  const truncated = truncateAddress(address, 6, 5)
  const name = info.value?.addressName
  const hasCustomName = !!name && name !== truncateAddress(address, 6, 4)
  return hasCustomName ? `${name} (${truncated})` : truncated
})
const { connect, openExtensionAccounts, watchExtensionAccounts } =
  useConnectWallet()

const isOpen = computed<boolean>({
  get: () => !!info.value,
  set: open => {
    if (!open) accessStore.clearAddressSavedInfo()
  },
})

// Back returns to the wallet chooser (still open underneath).
const onBack = (): void => accessStore.clearAddressSavedInfo()

// Re-attempt the same wallet's connect (picks up the extension's new address).
// Guarded so overlapping triggers (button + accountsChanged) only connect once.
const retry = (): void => {
  const config = info.value?.config
  if (!config) return
  accessStore.clearAddressSavedInfo()
  void connect(config)
}
const onTryAgain = retry

// "Open <wallet>": open the extension's account picker, then re-attempt.
const onOpenWallet = async (): Promise<void> => {
  const config = info.value?.config
  if (!config) return
  await openExtensionAccounts(config)
  retry()
}

// While the modal is up, auto-retry when the user switches account directly in
// the extension. Clearing the info tears the listener down (watch on info).
let cleanup: (() => void) | null = null
watch(
  info,
  v => {
    cleanup?.()
    cleanup = null
    if (v?.config) cleanup = watchExtensionAccounts(v.config, retry)
  },
  { immediate: true },
)
onUnmounted(() => cleanup?.())
</script>
