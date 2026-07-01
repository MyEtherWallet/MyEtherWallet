<template>
  <div>
    <button
      v-if="isWalletConnected && walletAddress"
      ref="triggerRef"
      class="relative hoverNoBG p-1 xs:py-2 xs:px-3 rounded-[24px] xs:rounded-full w-full shadow-button shadow-button-elevated"
      @click="setOpenDialog(true)"
    >
      <div class="flex items-center">
        <div class="relative">
          <app-blockie
            :address="walletAddress"
            :size="6"
            class="mr-1 rounded-full"
          />
          <icon-watch-only
            v-if="isXS"
            class="absolute w-3 h-3 p-[1px] inline-block text-info/50 bottom-[-2px] right-0 bg-white rounded-full shadow-button"
            :label="$t('watch_only_wallet')"
          />
        </div>

        <div v-if="!isXS" class="relative">
          <p
            v-if="isWatchOnly"
            class="text-s-8 text-left ml-1 text-info mb-[2px] -mt-1"
          >
            <span>
              <icon-watch-only
                class="w-3 h-3 inline-block text-info/50 mr-[3px]"
              /> </span
            >{{ $t('common.watch_only') }}
          </p>
          <div
            class="mr-2 ml-1 font-medium text-s-14 leading-p-100"
            :class="{ 'text-info !text-s-12': isWatchOnly }"
          >
            {{ truncateAddress(walletAddress, 6) }}
          </div>
        </div>
        <chevron-down-icon class="w-3 h-3 xs:w-4 xs:h-4 ml-auto xs:mr-1" />
      </div>
    </button>
    <the-manage-accounts v-model:open-dialog="openDialog" :anchor="triggerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppBlockie from '@/components/AppBlockie.vue'
import { useWalletStore } from '@/stores/walletStore'
import { truncateAddress } from '@/utils/filters'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import TheManageAccounts from '@/components/core_layouts/wallet/TheManageAccounts.vue'
import IconWatchOnly from '@/assets/icons/IconWatchOnly.vue'
const { isXS } = useAppBreakpoints()

const store = useWalletStore()
const { isWalletConnected, walletAddress, isWatchOnly } = storeToRefs(store)

defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
})

/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}
</script>
