<template>
  <div>
    <div v-if="isWalletConnected && walletAddress" class="">
      <div
        class="relative bg-grey-50 rounded-16 h-[165px] grid grid-rows-3 px-5 py-4 content-between text-white"
      >
        <img
          ref="mewCard"
          :src="'https://mewcard.mewapi.io/?address=' + walletAddress"
          alt="MEW Card"
          width="670"
          height="424"
          class="rounded-16 drop-shadow absolute z-0"
          @load="animateMewCard"
        />
        <!-- wallet address, wallet menu, link to explorer-->
        <div class="flex items-start justify-between z-1 relative">
          <div class="pl-2">
            <button
              class="p-1 text-s-12 font-bold leading-p-100 rounded-full hover:bg-white/15 transition-all duration-300 flex items-center"
              @click="setOpenDialog(true)"
            >
              <!-- TODO: add ens resolution-->
              <p>my wallet</p>
              <chevron-down-icon class="w-[10px] h-[10px] ml-1" />
            </button>
            <p class="text-[10px] leading-p-110 pl-1">
              {{ truncateAddress(walletAddress, 6) }}
            </p>
          </div>
          <!-- TODO: add proper link per chain-->
          <a
            :href="`https://www.ethvm.com/address/${walletAddress}`"
            aria-label="View in block explorer"
            target="_blank"
            class="rounded-[8px] !cursor-pointer p-1 flex items-center justify-center backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
          >
            <ArrowTopRightOnSquareIcon class="w-4 h-4" />
          </a>
        </div>
        <!-- Portfolio value-->
        <div class="flex flex-col justify-center h-[44px] z-1 relative">
          <p
            v-if="!isLoadingBalances"
            class="font-bold text-s-32 leading-p-130"
          >
            {{ formattedTotalFiatPortflioValue }}
          </p>
          <div
            v-else
            class="h-8 w-32 bg-white/15 rounded-12 animate-pulse"
          ></div>
        </div>
        <!-- Token balances and Actions-->
        <div
          class="self-end pl-3 flex items-center justify-between z-1 relative"
        >
          <div v-if="!isLoadingBalances">
            <p class="text-s-14 leading-p-140">
              {{ formattedBalance }} {{ mainTokenBalance?.symbol || '' }}
            </p>
            <p class="text-s-12 leading-p-150">
              and {{ tokens.length }} Tokens
            </p>
          </div>
          <div
            v-else
            class="h-[38px] w-24 bg-white/15 rounded-12 animate-pulse"
          ></div>
          <div class="flex gap-2">
            <button
              class="rounded-[10px] !cursor-pointer p-1 h-8 w-8 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            >
              <QrCodeIcon class="w-6 h-6" />
            </button>
            <button
              class="rounded-[10px] !cursor-pointer p-1 h-8 w-8 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
              @click="copyClick"
            >
              <ClipboardDocumentIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <the-address-menu-dialog v-model:open-dialog="openDialog" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import TheAddressMenuDialog from '@/components/core_layouts/wallet/TheAddressMenuDialog.vue'
import { truncateAddress } from '@/utils/filters'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useWalletStore } from '@/stores/walletStore'
import {
  ClipboardDocumentIcon,
  QrCodeIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'
import { animate } from 'animejs'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toastStore = useToastStore()
const walletStore = useWalletStore()
const {
  tokens,
  walletAddress,
  isWalletConnected,
  formattedBalance,
  formattedTotalFiatPortflioValue,
  mainTokenBalance,
  isLoadingBalances,
  walletCardWasAnimated,
} = storeToRefs(walletStore)

/**
 * Copies the copyValue to the clipboard.
 */
const copy = () => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .writeText(walletAddress.value || '')
      .then(resolve)
      .catch(reject)
  })
}
/**
 * emits the close event when the close button is clicked.
 */
const copyClick = () => {
  copy()
  toastStore.addToastMessage({
    text: `${t('common.copied_to_clipboard')}: ${walletAddress.value}`,
  })
}

/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}

/**
 * Animates wallet card
 */
const animateMewCard = (event: Event) => {
  if (walletCardWasAnimated.value) return
  const el = event.currentTarget as HTMLElement
  el.style.opacity = '0'
  animate(el, {
    opacity: 1,
    delay: 1100,
    duration: 500,
    easing: 'easeInOutQuad',
  })
  walletCardWasAnimated.value = true
}
</script>
<style scoped>
.drop-shadow {
  filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.24)),
    drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.24));
}
.mew-card {
  opacity: 0;
  border-radius: 16px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  height: 100%;
  img {
    height: 100%;
    width: 100%;
  }
}
</style>
