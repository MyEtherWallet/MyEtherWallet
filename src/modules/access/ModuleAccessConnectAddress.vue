<template>
  <app-dialog
    v-model:is-open="isOpen"
    persistent
    :has-content-gutter="true"
    class="w-full sm:max-w-[400px] sm:mx-auto"
  >
    <template #title>
      <button
        data-test="connect-address-back"
        aria-label="back"
        class="absolute top-4 left-4 flex items-center justify-center size-8 rounded-full hoverNoBG"
        @click="onBack"
      >
        <chevron-left-icon class="w-5 h-5 text-black" />
      </button>
    </template>
    <template #content>
      <div class="flex flex-col items-center gap-6 px-2 pt-8 pb-4 text-center">
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
        <div class="flex flex-col gap-1 w-full">
          <p class="text-s-16 font-semibold text-black leading-[22px]">
            {{ $t('multi_address.connect_address_modal.title') }}
          </p>
          <p class="text-s-14 text-[#575757] leading-[20px]">
            {{ $t('multi_address.connect_address_modal.subtitle', { wallet: info?.walletName }) }}
          </p>
        </div>
        <div class="w-full rounded-[24px] bg-[#f5f5f5] p-6">
          <p class="text-s-16 text-black text-center break-all leading-[22px]">
            {{ info?.address }}
          </p>
        </div>
        <button
          data-test="connect-address-open"
          class="h-12 w-full rounded-[24px] bg-primary text-white text-s-16 font-semibold flex items-center justify-center gap-2"
          @click="onOpenWallet"
        >
          {{ $t('multi_address.connect_address_modal.open_wallet', { wallet: info?.walletName }) }}
          <arrow-top-right-on-square-icon class="w-5 h-5" />
        </button>
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

const accessStore = useAccessStore()
const { connectAddressInfo: info } = storeToRefs(accessStore)
const { connect, openExtensionAccounts, watchExtensionAccounts } =
  useConnectWallet()

const isOpen = computed<boolean>({
  get: () => !!info.value,
  set: open => {
    if (!open) accessStore.clearConnectAddressInfo()
  },
})

const onBack = (): void => accessStore.clearConnectAddressInfo()

// Re-attempt the connect; _storeWallet re-checks the active vs intended address
// and only proceeds when they match (else this modal shows again).
const retry = (): void => {
  const config = info.value?.config
  if (!config) return
  accessStore.clearConnectAddressInfo()
  void connect(config)
}

// "Open <wallet>": open the extension's account picker, then re-attempt.
const onOpenWallet = async (): Promise<void> => {
  const config = info.value?.config
  if (!config) return
  await openExtensionAccounts(config)
  retry()
}

// Auto-retry when the user switches account directly in the extension.
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
