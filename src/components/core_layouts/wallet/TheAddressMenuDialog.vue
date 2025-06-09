<template>
  <app-dialog
    v-if="isWalletConnected"
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
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import { useWalletStore } from '@/stores/walletStore'

const store = useWalletStore()
const { isWalletConnected } = storeToRefs(store)

/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = defineModel<boolean>('openDialog', {
  default: false,
})
</script>
