<template>
  <app-modal
    v-if="isWalletConnected && isLoadedChainsData"
    v-model="openDialog"
    :title="
      $t('common.deposit_title', {
        chain: selectedChain?.nameLong || 'Ethereum',
      })
    "
    class="min-h-[400px]"
  >
    <template #header>
      <app-avatar
        v-if="selectedChain?.icon"
        type="network"
        size="xl"
        :url="selectedChain.icon"
        :chain="selectedChain.name"
      />
    </template>
    <div
      v-if="walletAddress"
      class="flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <app-content-group
        :title="
          $t('common.deposit_title', {
            chain: selectedChain?.nameLong || 'Ethereum',
          })
        "
        :description="
          $t('common.deposit_description', {
            chain: selectedChain?.nameLong || 'Ethereum',
          })
        "
        size="l"
        wrap-title
      />
      <div class="flex items-center justify-center">
        <!-- QR stays on white in every theme so it remains scannable. -->
        <div
          class="rounded-30 p-8 shadow-button-elevated bg-white flex items-center justify-center"
        >
          <div
            v-show="!isLoadingQRCode"
            ref="qrCode"
            class="qr-code-container"
          ></div>
          <app-skeleton
            v-show="isLoadingQRCode"
            shape="rectangle-rounded"
            class="size-[150px]"
          />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <app-avatar
          type="account"
          size="xl"
          :address="walletAddress"
          class="shrink-0"
        />
        <!-- break-all is inherited by the title span so the hex wraps. -->
        <app-content-group
          :title="walletAddress"
          wrap-title
          class="flex-1 break-all"
        />
        <div class="flex items-center gap-1">
          <app-btn-copy
            :copy-value="walletAddress"
            size="l"
            class="text-text-brand"
          />
          <app-btn-icon
            :href="getExplorerLink"
            :label="$t('view_in_block_explorer')"
            icon="arrow-top-right-on-square"
            class="text-text-brand"
          />
        </div>
      </div>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppModal from '@/components/modal/AppModal.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useQR } from '@/composables/useQR'
import { watch, computed } from 'vue'
import { analytics, DepositEvent } from '@/analytics'

const walletStore = useWalletStore()
const { isWalletConnected, walletAddress } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { selectedChain, isLoaded: isLoadedChainsData } = storeToRefs(chainsStore)

/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = defineModel<boolean>('openDialog', {
  default: false,
})

/** -------------------
 * QR Code Controls
 -------------------*/
const { qrCode, isLoadingQRCode, setQRCode } = useQR()

watch(
  () => [walletAddress.value, openDialog.value, qrCode.value],
  () => {
    if (openDialog.value && walletAddress.value && qrCode.value) {
      if (qrCode.value.innerHTML === '') {
        setQRCode(walletAddress.value, 200, 200)
      }
      analytics.trackDepositEvent(DepositEvent.SHOWN)
    }
  },
)

const getExplorerLink = computed(() => {
  return selectedChain.value?.blockExplorerAddr.replace(
    '[[address]]',
    walletAddress.value || '',
  )
})
</script>
