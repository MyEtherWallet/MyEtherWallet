<template>
  <app-modal
    v-if="isWalletConnected && isLoadedChainsData"
    v-model="openDialog"
    :title="$t('common.deposit_title', { chain: chainName })"
  >
    <!-- Left-aligned header (AppModal's default one is centred); pr-16 leaves
         24px between the text and the close button. `title` above stays the label. -->
    <template #header>
      <app-content-group
        :title="$t('common.deposit_title', { chain: chainName })"
        :description="$t('common.deposit_description', { chain: chainName })"
        size="l"
        wrap-title
        class="w-full pr-16"
      />
    </template>
    <div
      v-if="walletAddress"
      class="flex flex-col items-center gap-6 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <!-- The QR draws on a transparent background, so it keeps a white tile in
           every theme to stay scannable; only dark mode needs a quiet zone. -->
      <div
        data-test="deposit-qr"
        class="relative size-50 bg-white dark:box-content dark:rounded-16 dark:p-3"
      >
        <div v-show="!isLoadingQRCode" ref="qrCode" class="qr-code-container" />
        <app-skeleton
          v-show="isLoadingQRCode"
          shape="rectangle-rounded"
          class="size-full"
        />
        <!-- The chain mark covers well under the 25% of the code that its
             error correction (level Q) can recover. -->
        <div
          v-if="selectedChain?.icon && !isLoadingQRCode"
          class="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-white"
        >
          <app-avatar
            type="network"
            size="l"
            :url="selectedChain.icon"
            :chain="selectedChain.name"
          />
        </div>
      </div>
      <div class="flex w-full items-center gap-3">
        <app-avatar
          type="account"
          size="m"
          :address="walletAddress"
          class="shrink-0"
        />
        <!-- Multi-address truncation, as long as one line fits; copy keeps the full value. -->
        <app-content-group :title="shortAddress" class="min-w-0 flex-1" />
        <!-- Naked Button Icons inherit the glyph color from here. -->
        <div class="flex shrink-0 items-center gap-1 text-icon-brand">
          <app-btn-copy :copy-value="walletAddress" size="m" icon-size="m" />
          <app-btn-icon
            :href="getExplorerLink"
            :label="$t('view_in_block_explorer')"
            icon="arrow-top-right-on-square"
            size="m"
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
import { truncateAddress } from '@/utils/filters'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useQR } from '@/composables/useQR'
import { watch, computed } from 'vue'
import { analytics, DepositEvent } from '@/analytics'

const walletStore = useWalletStore()
const { isWalletConnected, walletAddress } = storeToRefs(walletStore)
const chainsStore = useChainsStore()
const { selectedChain, isLoaded: isLoadedChainsData } = storeToRefs(chainsStore)
const chainName = computed(() => selectedChain.value?.nameLong || 'Ethereum')

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

// The row leaves ~170px for the address on a phone and ~290px from sm (480px
// modal), so show as many characters as fit on one line.
const { isMobile } = useAppBreakpoints()
const shortAddress = computed(() =>
  isMobile.value
    ? truncateAddress(walletAddress.value || '', 8, 6)
    : truncateAddress(walletAddress.value || '', 12, 10),
)

const getExplorerLink = computed(() => {
  return selectedChain.value?.blockExplorerAddr.replace(
    '[[address]]',
    walletAddress.value || '',
  )
})
</script>
