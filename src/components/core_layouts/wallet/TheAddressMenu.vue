<template>
  <div>
    <button
      v-if="isWalletConnected && walletAddress"
      class="hoverNoBG p-1 xs:py-2 xs:px-3 rounded-[24px] xs:rounded-full w-full shadow-button shadow-button-elevated"
      @click="setOpenDialog(true)"
    >
      <div class="flex items-center">
        <app-blockie
          :address="walletAddress"
          :size="6"
          class="mr-1 rounded-full"
        />
        <div v-if="!isXS" class="mr-2 ml-1 font-medium text-sm">
          {{ truncateAddress(walletAddress, 6) }}
        </div>
        <chevron-down-icon class="w-3 h-3 xs:w-4 xs:h-4 ml-auto xs:mr-1" />
      </div>
    </button>
    <the-address-menu-dialog v-model:open-dialog="openDialog" />
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
import TheAddressMenuDialog from '@/components/core_layouts/wallet/TheAddressMenuDialog.vue'
const { isXS } = useAppBreakpoints()

const store = useWalletStore()
const { isWalletConnected, walletAddress } = storeToRefs(store)

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
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}
</script>
