<template>
  <div
    class="flex flex-col justify-center items-center gap-3 rounded-20 bg-surface p-2 min-h-[129px]"
  >
    <p class="text-center text-s-14">{{ $t('common.dont_have_wallet') }}</p>
    <app-base-button
      isOutline
      class="bg-white h-12 !py-0 !px-0 w-full"
      size="medium"
      @click="goToCreateWallet"
    >
      <span> {{ $t('common.create_wallet') }}</span>
    </app-base-button>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useCreateStore } from '@/stores/createStore'
import { useAccessStore } from '@/stores/accessStore'

const createStore = useCreateStore()
const accessStore = useAccessStore()

const goToCreateWallet = () => {
  accessStore.closeAccessDialog()
  createStore.openCreateDialog()
}
</script>
