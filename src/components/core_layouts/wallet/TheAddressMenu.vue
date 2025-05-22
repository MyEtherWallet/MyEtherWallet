<template>
  <div>
    <button
      v-if="isWalletConnected"
      class="hoverNoBG p-1 xs:py-2 xs:px-3 rounded-[24px] xs:rounded-full w-full shadow-button shadow-button-elevated"
      @click="setOpenDialog(true)"
    >
      <div v-if="isWalletConnected && walletAddress" class="flex items-center">
        <app-blockie
          :address="walletAddress"
          :size="6"
          is-flat
          class="mr-1 rounded-full"
        />
        <div v-if="!isXS" class="mr-2 ml-1 font-medium text-sm">
          {{ truncateAddress(walletAddress, 6) }}
        </div>
        <chevron-down-icon class="w-3 h-3 xs:w-4 xs:h-4 ml-auto xs:mr-1" />
      </div>
    </button>
    <router-link
      v-else
      :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
      class="px-4 py-2 bg-black text-white h-10 rounded-full hoverOpacity"
    >
      {{ $t('connect_wallet') }}
    </router-link>
    <!-- Dialog with chains list -->
    <app-dialog
      v-if="isWalletConnected && walletAddress"
      v-model:is-open="openDialog"
      title="Address Menu"
      class="xs:max-w-[428px] sm:mx-auto"
    >
      <template #content>
        <div class="p-5">
          <p class="text-center">Temp Menu</p>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import { useWalletStore } from '@/stores/walletStore'
import { truncateAddress } from '@/utils/filters'
import { ROUTES_ACCESS } from '@/router/routeNames'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

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
