<template>
  <div>
    <div v-if="isWalletConnected && walletAddress" class="">
      <div
        class="relative bg-grey-50 rounded-16 h-[205px] grid grid-rows-3 px-5 py-4 content-between text-white shadow-button"
      >
        <img
          ref="mewCard"
          :src="'https://mewcard.mewapi.io/?address=' + walletAddress"
          alt="MEW Card"
          width="670"
          height="424"
          class="rounded-16 drop-shadow absolute z-0 h-[205px] w-full"
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
              {{ truncateAddress(walletAddress) }}
            </p>
          </div>
          <div class="flex items-center ml-2 gap-2">
            <!-- Copy address button -->
            <button
              :aria-label="$t('common.copy_address')"
              class="rounded-full !cursor-pointer p-2 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
              @click="copyClick"
            >
              <ClipboardDocumentIcon class="w-5 h-5" />
            </button>
            <!-- Link to block explorer -->
            <a
              :href="getExplorerLink"
              :aria-label="$t('view_in_block_explorer')"
              target="_blank"
              class="rounded-full !cursor-pointer p-2 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            >
              <ArrowTopRightOnSquareIcon class="w-5 h-5" />
            </a>
          </div>
        </div>
        <!-- Portfolio value-->
        <div
          class="flex flex-row justify-start items-center z-1 relative gap-3"
        >
          <p
            v-if="!isLoadingBalances"
            class="font-bold text-s-32 leading-p-130"
          >
            {{ formattedTotalFiatPortfolioValue }}
          </p>
          <div
            v-else
            class="h-8 w-32 bg-white/15 rounded-12 animate-pulse"
          ></div>
        </div>
        <!-- Token balances -->
        <div
          class="self-end pl-3 flex items-center justify-between z-1 relative"
        >
          <div v-if="!isLoadingBalances">
            <p class="text-s-14 leading-p-140">
              {{ formattedBalance }} {{ safeMainTokenBalance?.symbol || '' }}
            </p>
            <p class="text-s-12 leading-p-150">
              and {{ tokens.length }} Tokens
            </p>
          </div>
          <div
            v-else
            class="h-[38px] w-24 bg-white/15 rounded-12 animate-pulse"
          ></div>
          <!-- Refresh balance button -->
          <button
            :aria-label="$t('refresh_balance')"
            class="rounded-full !cursor-pointer p-2 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            @click="fetchBalances"
          >
            <ArrowPathIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <the-address-menu-dialog v-model:open-dialog="openDialog" />
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import TheAddressMenuDialog from '@/components/core_layouts/wallet/TheAddressMenuDialog.vue'
import TheDepositDialog from './core_layouts/wallet/TheDepositDialog.vue'
import { truncateAddress } from '@/utils/filters'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useWalletStore } from '@/stores/walletStore'
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'
import { animate } from 'animejs'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'
import { useChainsStore } from '@/stores/chainsStore'
import useBalanceHandler from '@/utils/balanceHandler'

const { t } = useI18n()
const toastStore = useToastStore()
const walletStore = useWalletStore()
const {
  wallet,
  tokens,
  walletAddress,
  isWalletConnected,
  formattedBalance,
  formattedTotalFiatPortfolioValue,
  safeMainTokenBalance,
  isLoadingBalances,
  walletCardWasAnimated,
} = storeToRefs(walletStore)
const { setTokens, setIsLoadingBalances } = walletStore

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const fetchBalances = () => {
  setIsLoadingBalances(true)
  wallet.value?.getBalance().then(balances => {
    useBalanceHandler(balances, setTokens, setIsLoadingBalances)
  })
}
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
 * Dialogs
 -------------------------------*/
const openDepositDialog = ref(false) //deposit dialog
const openDialog = ref(false) // address menu dialog
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

const getExplorerLink = computed(() => {
  return selectedChain.value?.blockExplorerAddr.replace(
    '[[address]]',
    walletAddress.value || '',
  )
})
</script>
<style scoped>
.drop-shadow {
  filter:
    drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.24)),
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
