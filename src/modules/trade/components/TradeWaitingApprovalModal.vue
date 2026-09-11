<template>
  <app-dialog
    v-model:is-open="model"
    close-class="top-6 right-6"
    class="w-full sm:w-[480px] sm:mx-auto !rounded-20"
  >
    <template #content>
      <div
        class="mt-20 mb-20 h-[440px] w-full py-6 px-12 flex flex-col items-center justify-between text-center"
      >
        <div class="flex flex-col items-center gap-1 w-full">
          <h2 class="text-s-20 font-bold leading-[22px] tracking-[-0.4px]">
            {{ $t('trade.waiting_approval.title') }}
          </h2>
          <p class="text-s-16 leading-[22px] text-info">
            {{ $t('trade.waiting_approval.subtitle') }}
          </p>
        </div>

        <div class="relative w-[240px] h-[200px]" aria-hidden="true">
          <img :src="waitingApprovalImage" alt="" class="w-full h-full" />
          <div
            v-if="walletIcon || walletAddress"
            class="absolute top-12 left-[124px] w-10 h-10 rounded-full bg-bgBase flex items-center justify-center"
          >
            <img
              v-if="walletIcon"
              :src="walletIcon"
              alt=""
              class="w-10 h-10 rounded-full"
            />
            <app-blockie
              v-else-if="walletAddress"
              :address="walletAddress"
              :size="10"
              is-flat
              class="rounded-full overflow-hidden"
            />
          </div>
        </div>

        <div class="w-full text-s-14 leading-[20px]">
          <p class="font-semibold tracking-[-0.28px]">
            {{ $t('trade.waiting_approval.help_title') }}
          </p>
          <p class="text-info">
            {{ $t('trade.waiting_approval.help_text') }}
          </p>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useProviderStore } from '@/stores/providerStore'
import waitingApprovalImage from '@/assets/images/trade/waiting-approval.jpg'

const model = defineModel<boolean>('isOpen', { default: false })

const walletStore = useWalletStore()
const { walletName, wallet, walletAddress } = storeToRefs(walletStore)
const providerStore = useProviderStore()
const { providers } = storeToRefs(providerStore)

const walletIcon = computed(() => {
  const name = walletName.value?.toLowerCase()
  const providerIcon = name
    ? providers.value.find(p => p.info.name.toLowerCase() === name)?.info.icon
    : undefined
  if (providerIcon) return providerIcon
  const connector = (
    wallet.value as {
      connector?: { icon?: string; rkDetails?: { iconUrl?: string } }
    } | null
  )?.connector
  return connector?.icon ?? connector?.rkDetails?.iconUrl ?? ''
})
</script>
