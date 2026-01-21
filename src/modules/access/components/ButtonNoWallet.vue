<template>
  <button
    class="block text-info text-s-14 sm:text-s-17 leading-p-150 hoverOpacity"
    @click="goToCreateWallet"
  >
    {{ $t('wc_dialog.no_wallet') }}
    <span class="underline">
      {{ $t('wc_dialog.get_wallet') }}
      <span class="text-sm"> →</span></span
    >
  </button>
</template>

<script setup lang="ts">
import { useCreateStore } from '@/stores/createStore'
import { useAccessStore } from '@/stores/accessStore'

const createStore = useCreateStore()
const accessStore = useAccessStore()

const goToCreateWallet = () => {
  accessStore.closeAccessDialog()
  createStore.openCreateDialog()
}
</script>
