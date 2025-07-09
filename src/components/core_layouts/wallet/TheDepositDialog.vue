<template>
  <app-dialog
    v-if="isWalletConnected && isLoadedChainsData"
    v-model:is-open="openDialog"
    class="xs:max-w-[400px] sm:mx-auto !min-h-[400px]"
    :z-index="200"
  >
    <template #title>
      <div>
        <img
          v-if="selectedChain?.icon"
          class="mr-4 mt-4 w-8 h-8 rounded-full overflow-hidden shadow-token"
          :src="selectedChain?.icon"
          alt=""
        />
      </div>
    </template>
    <template #content>
      <div v-if="walletAddress" class="px-7 pb-5">
        <h1 class="text-s-28 font-bold text-left leading-p-130">
          {{
            $t('common.deposit_title', {
              chain: selectedChain?.nameLong || 'Ethereum',
            })
          }}
        </h1>
        <p class="text-s-15 text-p-130 my-1">
          {{
            $t('common.deposit_description', {
              chain: selectedChain?.nameLong || 'Ethereum',
            })
          }}
        </p>
        <div class="flex items-center justify-center my-5 sm:my-9">
          <div
            class="rounded-16 p-3 shadow-button shadow-button-elevated h-[174px] w-[174px] flex items-center justify-center"
          >
            <div v-show="!isLoadingQRCode" ref="qrCode"></div>
            <!-- Loading QR Placeholder -->
            <div
              v-show="isLoadingQRCode"
              class="h-[150px] w-[150px] animate-pulse bg-grey-10 rounded-xl"
            ></div>
          </div>
          <!-- QR Code -->
        </div>
        <div class="flex items-center mb-3">
          <app-blockie
            :address="walletAddress"
            :size="9"
            class="flex-none rounded-full"
          />
          <div
            class="ml-4 mr-2 font-medium text-wrap break-all max-w-[300px] tracking-sp-06"
          >
            {{ walletAddress }}
          </div>
          <!-- Copy -->
          <app-btn-copy
            :copy-value="walletAddress"
            class="!min-w-8 h-8 text-primary"
          >
          </app-btn-copy>
          <!-- Block Explorer Link -->
          <a
            :href="`https://www.ethvm.com/address/${walletAddress}`"
            :aria-label="$t('view_in_block_explorer')"
            target="_blank"
            class="rounded-full !cursor-pointer min-w-8 h-8 flex items-center justify-center hoverNoBG"
          >
            <ArrowTopRightOnSquareIcon class="w-5 h-5 text-primary" />
          </a>
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
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import QRCodeStyling, { type DrawType, type DotType } from 'qr-code-styling'
import { ref, defineModel, watch } from 'vue'

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
const isLoadingQRCode = ref(true)

const options = ref({
  width: 150,
  height: 150,
  type: 'svg' as DrawType,
  data: '',
  image: '',
  margin: 0,
  dotsOptions: {
    color: '#000',
    type: 'extra-rounded' as DotType,
  },
  cornersDotOptions: {
    color: 'rgb(0,90,229,1',
    type: 'extra-rounded' as DotType,
  },
  backgroundOptions: {
    color: 'transparent',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 10,
  },
})

const qrCode = ref<HTMLDivElement | null>(null)
const qrCodeStyling = new QRCodeStyling(options.value)

const setQRCode = () => {
  try {
    options.value.data = walletAddress.value || ''
    qrCodeStyling.update(options.value)
    isLoadingQRCode.value = false
    if (qrCode.value) {
      qrCodeStyling.append(qrCode.value)
    }
  } catch (error) {
    console.error('Failed to append QR Code:', error)
  }
}
watch(
  () => [walletAddress.value, openDialog.value, qrCode.value],
  () => {
    if (openDialog.value) setQRCode()
  },
)
</script>
