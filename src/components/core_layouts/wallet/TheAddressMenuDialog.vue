<template>
  <div>
    <app-dialog
      v-if="isWalletConnected"
      v-model:is-open="openDialog"
      class="xs:w-[360px] sm:mx-auto !min-h-[200px]"
    >
      <template #title>
        <div class="flex items-center pr-2 pt-4 pl-6">
          <IconWatchOnly
            v-if="isWatchOnly"
            class="w-6 h-6 inline-block mr-2 mt-[2px]"
          />
          <p class="text-s-24 font-bold">
            {{ isWatchOnly ? $t('watch_only_wallet') : $t('connected_wallet') }}
          </p>
        </div>
      </template>
      <template #content>
        <div class="px-5 xs:px-6 pt-2 pb-5">
          <app-wallet-card hide-connect-btn @close="closeDialog" />
        </div>
      </template>
    </app-dialog>
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'
import { useWalletStore } from '@/stores/walletStore'
import { ref } from 'vue'
import IconWatchOnly from '@/assets/icons/IconWatchOnly.vue'
import AppWalletCard from '@/components/AppWalletCard.vue'

const store = useWalletStore()

const { isWalletConnected, isWatchOnly } = storeToRefs(store)

/** -------------------------------
 * Dialog
 -------------------------------*/

const openDepositDialog = ref(false) //deposit dialog

const openDialog = defineModel<boolean>('openDialog', {
  default: false,
})

/** -------------------------------
 * Actions
 -------------------------------*/

const closeDialog = () => {
  openDialog.value = false
}
</script>
