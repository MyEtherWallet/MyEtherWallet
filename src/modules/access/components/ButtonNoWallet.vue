<template>
  <button
    class="block text-fg-subtle text-s-14 sm:text-s-17 leading-p-150 hoverOpacity"
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
import { analytics } from '@/analytics'
import { CreateWalletEvent } from '@/analytics/events'
const createStore = useCreateStore()
const accessStore = useAccessStore()

const goToCreateWallet = () => {
  accessStore.closeAccessDialog()
  analytics.trackCreateWalletEvent(CreateWalletEvent.CLICKED, {
    source: 'Access_Button_Secondary',
  })
  createStore.openCreateDialog()
}
</script>
