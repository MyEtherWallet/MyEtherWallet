<template>
  <div class="flex flex-col h-full min-h-0 p-4">
    <div class="shrink-0 flex items-center">
      <button
        data-test="connect-address-view-back"
        aria-label="back"
        class="size-10 rounded-full hoverNoBG flex items-center justify-center"
        @click="onBack"
      >
        <chevron-left-icon class="w-5 h-5 text-black" />
      </button>
    </div>
    <div
      class="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-6 px-2 pt-4 text-center"
    >
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
    </div>
    <!-- Hidden for now (MEW-1840): "Open <wallet>" CTA — no reliable API to
         open the extension popup (esp. BTC). Kept for quick re-enable. -->
    <button
      v-if="false"
      data-test="connect-address-view-open"
      class="shrink-0 mt-4 h-12 w-full rounded-[24px] bg-primary text-white text-s-16 font-semibold flex items-center justify-center gap-2"
      @click="onOpenWallet"
    >
      {{ $t('multi_address.connect_address_modal.open_wallet', { wallet: info?.walletName }) }}
      <arrow-top-right-on-square-icon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  ChevronLeftIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/solid'
import { useAccessStore } from '@/stores/accessStore'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'

const emit = defineEmits<{ back: [] }>()

const accessStore = useAccessStore()
const { connectAddressInfo: info } = storeToRefs(accessStore)
const { connect, openExtensionAccounts, watchExtensionAccounts } =
  useConnectWallet()

const onBack = (): void => {
  accessStore.clearConnectAddressInfo()
  // The connect flow opened the access dialog behind the popup; close it too.
  accessStore.closeAccessDialog()
  emit('back')
}

const retry = (): void => {
  const config = info.value?.config
  if (!config) return
  accessStore.clearConnectAddressInfo()
  void connect(config)
}

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
