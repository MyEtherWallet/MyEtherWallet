<template>
  <app-dialog
    v-if="isWalletConnected && isLoadedChainsData"
    v-model:is-open="openDialog"
    class="xs:max-w-[420px] sm:mx-auto !min-h-[400px]"
    z-index-overlay="z-[200]"
    z-index-container="z-[201]"
  >
    <template #title>
      <div class="px-3 mt-3">
        <app-token-logo
          v-if="selectedChain?.icon"
          :url="selectedChain?.icon"
          :symbol="selectedChain.currencyName"
          width="w-12"
          height="h-12"
        ></app-token-logo>
      </div>
    </template>
    <template #content>
      <div v-if="walletAddress" class="px-8 pb-8 flex flex-col gap-2">
        <h1 class="text-s-28 font-bold text-left leading-tight">
          {{
            $t('common.deposit_title', {
              chain: selectedChain?.nameLong || 'Ethereum',
            })
          }}
        </h1>
        <p class="text-s-15 text-grey-60 leading-relaxed max-w-[320px]">
          {{
            $t('common.deposit_description', {
              chain: selectedChain?.nameLong || 'Ethereum',
            })
          }}
        </p>
        <div class="flex items-center justify-center my-6">
          <div
            class="rounded-30 p-8 shadow-button-elevated bg-white flex items-center justify-center"
          >
            <div
              v-show="!isLoadingQRCode"
              ref="qrCode"
              class="qr-code-container"
            ></div>
            <!-- Loading QR Placeholder -->
            <div
              v-show="isLoadingQRCode"
              class="h-[150px] w-[150px] animate-pulse bg-grey-10 rounded-xl"
            ></div>
          </div>
        </div>
        <div class="flex items-center gap-4 mt-2">
          <app-blockie
            :address="walletAddress"
            :size="12"
            class="flex-none rounded-full"
          />
          <div
            class="grow font-medium text-s-17 text-black break-all leading-tight tracking-sp-06"
          >
            {{ walletAddress }}
          </div>
          <div class="flex items-center gap-1">
            <!-- Copy -->
            <app-btn-copy
              :copy-value="walletAddress"
              class="!min-w-10 h-10 text-primary"
            >
            </app-btn-copy>
            <!-- Block Explorer Link -->
            <a
              :href="getExplorerLink"
              :aria-label="$t('view_in_block_explorer')"
              target="_blank"
              class="rounded-full !cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-primary-light transition-colors"
            >
              <ArrowTopRightOnSquareIcon class="w-6 h-6 text-primary" />
            </a>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useQR } from '@/composables/useQR'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
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
