<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[624px] flex flex-col items-center justify-center py-6 sm:py-10"
    >
      <app-sheet>
        <p v-if="clickedWalletConnect" class="mb-2 text-center">
          {{
            $t('wc_dialog.scan_qr_code', {
              walletName: clickedWalletConnect?.walletName,
            })
          }}
        </p>
        <div class="flex items-center justify-center">
          <!-- QR Code -->
          <div v-show="!isLoading" ref="qrCode" class="mt-5"></div>
          <!-- Loading QR Placeholder -->
          <div
            v-show="isLoading"
            class="h-[200px] w-[200px] sm:h-[280px] sm:w-[280px] flex items-center justify-center bg-grey-5 rounded-xl mt-5"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-primary animate-spin fill-white mx-auto"
              viewBox="0 0 100 101"
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
        <div
          class="flex items-center justify-center mt-2 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <p>{{ $t('wc_dialog.or_copy_link') }}</p>
          <AppCopyButton
            v-if="clickedWalletConnect"
            :copy-value="clickedWalletConnect.wagmiWalletData"
          />
        </div>
        <a
          class="text-info text-center text-xs mx-auto block"
          href="https://walletconnect.network/"
          target="_blank"
          rel="noreferrer"
        >
          {{ $t('common.powered_by') }} WalletConnect
        </a>
      </app-sheet>
      <!-- TODO: add link-->
      <div
        class="mt-5 block text-info text-s-14 sm:text-s-17 leading-p-150 hoverOpacity"
      >
        {{ $t('wc_dialog.no_wallet') }}
        <span class="underline">
          {{ $t('wc_dialog.get_wallet') }}
          <span class="text-sm"> →</span></span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, watch, computed } from 'vue'
import AppCopyButton from '@/components/AppBtnCopy.vue'
import AppSheet from '@/components/AppSheet.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useQR } from '@/composables/useQR'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'
const { isMobile } = useAppBreakpoints()

const accessStore = useAccessStore()
const { clickedWalletConnect } = storeToRefs(accessStore)

/** -------------------
 * QR Code Controls
 -------------------*/
const qrWidth = ref(isMobile.value ? 200 : 280)
const qrHeight = ref(isMobile.value ? 200 : 280)
const { qrCode, isLoadingQRCode, setQRCode } = useQR()

const isLoading = computed(() => {
  return (
    isLoadingQRCode.value ||
    !clickedWalletConnect.value?.wagmiWalletData ||
    clickedWalletConnect.value?.wagmiWalletData == ''
  )
})
/**
 * Watches for changes and updates the QR code styling accordingly.
 *
 * This effect performs the following actions:
 * 1. Sets the loading state for the QR code.
 * 2. Adjusts the QR code dimensions based on whether the device is mobile or not.
 * 3. Sets the QR code data from the component props.
 * 4. Sets wallet icon URL if provided.
 * 5. Updates the QR code styling with the new options.
 * 6. Appends the QR code to the DOM if the QR code element is available.
 *
 * If an error occurs during the process, it logs the error to the console.
 *
 * @async
 * @function watchEffect
 * @returns {Promise<void>}
 */
watchEffect(async () => {
  if (isMobile.value) {
    qrWidth.value = 200
    qrHeight.value = 200
  } else {
    qrWidth.value = 280
    qrHeight.value = 280
  }
})

watch(
  () => [
    clickedWalletConnect.value?.wagmiWalletData,
    clickedWalletConnect.value?.walletIcon,
    qrCode.value,
    qrWidth.value,
    qrHeight.value,
  ],
  () => {
    // clickedWallet.value?.icon is being resolved in wallet list components
    setQRCode(
      clickedWalletConnect.value?.wagmiWalletData,
      qrWidth.value,
      qrHeight.value,
      clickedWalletConnect.value?.walletIcon as string,
    )
  },
)
</script>
