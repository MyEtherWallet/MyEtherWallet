<template>
  <app-dialog
    v-model:is-open="isOpen"
    persistent
    :has-content-gutter="true"
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
      <div class="flex flex-col items-center gap-6 px-2 pt-12 pb-6 text-center">
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
            {{ info?.addressName }} ({{ truncateAddress(info?.address ?? '', 6, 5) }})
            {{ $t('multi_address.address_saved.title_suffix') }}
          </h2>
          <p class="text-s-14 text-[#575757] leading-[20px]">
            {{ $t('multi_address.address_saved.subtitle', { wallet: info?.walletName }) }}
          </p>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <button
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
import { computed } from 'vue'
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
const { connect } = useConnectWallet()

const isOpen = computed<boolean>({
  get: () => !!info.value,
  set: open => {
    if (!open) accessStore.clearAddressSavedInfo()
  },
})

// Back returns to the wallet chooser (still open underneath).
const onBack = (): void => accessStore.clearAddressSavedInfo()

// Informational only — the user switches the active address in their extension.
const onOpenWallet = (): void => {}

// Re-attempt the same wallet's connect (picks up the extension's new address).
const onTryAgain = (): void => {
  const config = info.value?.config
  accessStore.clearAddressSavedInfo()
  if (config) void connect(config)
}
</script>
