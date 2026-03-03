<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[640px] w-full flex flex-col items-center justify-center py-6 sm:py-10"
    >
      <app-sheet>
        <div
          class="flex flex-col items-center justify-center py-8 min-h-[340px]"
        >
          <!-- Wallet Icon -->
          <img
            v-if="clickedWeb3Wallet?.icon"
            :src="clickedWeb3Wallet.icon as string"
            :alt="clickedWeb3Wallet?.name"
            class="w-16 h-16 rounded-xl mb-6"
          />

          <!-- Error State -->
          <template v-if="web3ConnectionError">
            <p class="text-s-17 font-semibold text-center mb-2 text-error">
              {{ $t('web3_wallet.connection_failed') }}
            </p>
            <p class="text-info text-s-14 text-center mb-6">
              {{ web3ConnectionError }}
            </p>
            <app-base-button @click="handleRetry" class="min-w-[200px]">
              {{ $t('common.retry') }}
            </app-base-button>
          </template>

          <!-- Loading State -->
          <template v-else>
            <!-- Opening Message -->
            <p class="text-lg font-semibold text-center mb-2">
              {{
                $t('web3_wallet.opening_wallet', {
                  walletName: clickedWeb3Wallet?.name || 'wallet',
                })
              }}
            </p>
            <!-- Confirm Message -->
            <p class="text-info text-center mb-6">
              {{ $t('web3_wallet.confirm_in_extension') }}
            </p>
            <!-- Loading Spinner -->
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-primary animate-spin fill-white mb-6"
              viewBox="0 0 100 101"
              width="32"
              height="32"
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
          </template>
        </div>
      </app-sheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useAccessStore } from '@/stores/accessStore'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { storeToRefs } from 'pinia'

const accessStore = useAccessStore()
const { web3ConnectionError, clickedWeb3Wallet } = storeToRefs(accessStore)
const { connect } = useConnectWallet()

const handleRetry = () => {
  if (clickedWeb3Wallet.value) {
    connect(clickedWeb3Wallet.value)
  }
}
</script>
