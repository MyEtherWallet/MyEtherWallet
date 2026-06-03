<template>
  <div class="h-full">
    <div v-if="isWalletConnected && walletAddress" class="h-full">
      <div
        class="relative bg-grey-50 rounded-16 overflow-hidden h-full min-h-[241px] grid grid-rows-3 px-6 py-5 content-between text-white shadow-button"
      >
        <img
          ref="mewCard"
          :src="'https://mewcard.mewapi.io/?address=' + walletAddress"
          :alt="t('common.my_wallet')"
          width="500"
          height="424"
          class="rounded-16 drop-shadow absolute z-0 h-full w-full object-cover"
          @load="animateMewCard"
        />
        <!-- wallet address, wallet menu, link to explorer-->
        <div class="flex items-start justify-between relative">
          <div class="">
            <app-pop-up-menu placeholder="wallet menu" location="left">
              <template #menu-button="{ toggleMenu }">
                <button
                  class="p-1 text-s-11 font-bold leading-p-100 rounded-full hover:bg-white/15 transition-all duration-300 flex items-center"
                  @click="toggleMenu"
                >
                  <!-- TODO: add ens resolution-->
                  <p v-if="!isWatchOnly">{{ t('common.my_wallet') }}</p>
                  <p v-else>
                    <IconWatchOnly class="inline-block w-[12px] h-[12px]" />
                    {{ t('common.watch_only') }}
                  </p>
                  <chevron-down-icon class="w-[10px] h-[10px] ml-1" />
                </button>
              </template>
              <template #menu-content>
                <div class="py-4 min-w-[260px]">
                  <ul class="px-2 text-s-14">
                    <li
                      @click="setOpenPaperWalletDialog(true)"
                      class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center"
                    >
                      <QrCodeIcon
                        class="w-5 h-5 inline-block mr-2 text-primary"
                      />
                      {{ $t('view_paper_wallet') }}
                    </li>
                    <li
                      v-if="canSwitchAddress"
                      @click="switchAddress()"
                      class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center"
                    >
                      <UserGroupIcon
                        class="w-5 h-5 inline-block mr-2 text-primary"
                      />
                      {{ $t('switch_connected_address') }}
                    </li>
                  </ul>
                  <hr class="h-px bg-grey-10 border-0 w-full my-2" />
                  <ul class="px-2 text-s-14">
                    <li
                      @click="deleteWallet"
                      class="text-black p-2 rounded-8 hoverNoBG cursor-pointer flex items-center"
                    >
                      <TrashIcon class="w-5 h-5 inline-block mr-2 text-error" />
                      {{
                        isWatchOnly
                          ? $t('delete_watch_only_wallet')
                          : `${$t('disconnect_and_delete_wallet')}`
                      }}
                    </li>
                  </ul>
                </div>
              </template>
            </app-pop-up-menu>
            <p class="text-[11px] leading-p-110 pl-1">
              {{ truncateAddress(walletAddress, 12) }}
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
        <div class="flex flex-row justify-start items-center relative gap-3">
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
          <!-- Refresh balance button -->
          <button
            v-if="!isLoadingBalances"
            :aria-label="$t('refresh_balance')"
            class="rounded-full !cursor-pointer p-2 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            @click="fetchBalances"
          >
            <ArrowPathIcon class="w-5 h-5" />
          </button>
        </div>
        <!-- Token balances -->
        <div class="self-end flex items-center justify-between relative">
          <div v-if="!isLoadingBalances">
            <p class="text-s-14 leading-p-140">
              {{ formattedBalance }} {{ safeMainTokenBalance?.symbol || '' }}
            </p>
            <p class="text-s-12 leading-p-150">
              {{ t('common.and_tokens', tokens.length) }}
            </p>
          </div>
          <div
            v-else
            class="h-[38px] w-24 bg-white/15 rounded-12 animate-pulse"
          ></div>
          <button
            class="uppercase text-s-12 tracking-sp-06 font-medium rounded-full border-2 py-[6px] px-3 bg-white/[0.15] backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            @click="isWatchOnly ? openAccess() : disconnectWallet()"
          >
            {{ isWatchOnly ? t('common.connect') : t('common.disconnect') }}
          </button>
        </div>
      </div>
    </div>
    <the-paper-wallet v-model:is-open="openPaperWalletDialog" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import { truncateAddress } from '@/utils/filters'
import { ChevronDownIcon, QrCodeIcon } from '@heroicons/vue/24/solid'
import { useWalletStore } from '@/stores/walletStore'
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  UserGroupIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import { animate } from 'animejs'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'
import { useChainsStore } from '@/stores/chainsStore'
import useBalanceHandler from '@/utils/balanceHandler'
import IconWatchOnly from '@/assets/icons/IconWatchOnly.vue'
import ThePaperWallet from '@/components/core_layouts/wallet/ThePaperWallet.vue'
import { WalletType } from '@/providers/types'
import { useAccessStore } from '@/stores/accessStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { usePerpsAuth } from '@/modules/perps/composables/usePerpsAuth'
import { ACCESS_WALLET_VIEWS } from '@/modules/access/common/walletConfigs'
import { ToastType } from '@/types/notification'
import {
  analytics,
  ConnectWalletEvent,
  SelectNewAddressEvent,
} from '@/analytics'
import * as Sentry from '@sentry/vue'

const { t } = useI18n()
const emit = defineEmits<{
  (e: 'close'): void
}>()
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
  isWatchOnly,
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
 * Copies the wallet address to the clipboard.
 */
const copyClick = async () => {
  try {
    if (!walletAddress.value) throw new Error(t('common.error.no_wallet_address'))
    await navigator.clipboard.writeText(walletAddress.value)
    toastStore.addToastMessage({
      text: `${t('common.copied_to_clipboard')}`,
      hash: walletAddress.value,
    })
  } catch (err) {
    toastStore.addToastMessage({
      text: t('common.copy_failed'),
      type: ToastType.Error,
    })
    Sentry.captureException(err)
  }
}

/** -------------------------------
 * Dialogs
 -------------------------------*/
const openPaperWalletDialog = ref(false) //paper wallet dialog

const setOpenPaperWalletDialog = (value: boolean) => {
  openPaperWalletDialog.value = value
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

/** -------------------------------
 * Connect / Disconnect Wallet
 -------------------------------*/

const accessStore = useAccessStore()
const { setCurrentView, openAccessDialog } = accessStore

const openAccess = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: 'WalletCard_Connect',
  })
  openAccessDialog()
  emit('close')
}

const disconnectWallet = () => {
  walletStore.disconnectWallet()
  emit('close')
}

const deleteWallet = () => {
  const recentAddressStore = useWatchOnlyStore()
  recentAddressStore.removeWallet(
    walletAddress.value as string,
    selectedChain.value!,
  )
  usePerpsAuth().logout()
  disconnectWallet()
  emit('close')
}

/** -------------------------------
 * Address Switching
 -------------------------------*/
const canSwitchAddress = computed(() => {
  // only show switch address if wallet type is NOT private key AND NOT injected
  const type = wallet.value?.getWalletType()
  return (
    !!type &&
    type !== WalletType.PRIVATE_KEY &&
    type !== WalletType.INJECTED &&
    type !== WalletType.WAGMI
  )
})

const switchAddress = () => {
  analytics.trackSelectNewAddressEvent(SelectNewAddressEvent)

  // Map wallet types to their corresponding WALLET_VIEWS index
  const currentWalletType = wallet.value?.getWalletType()
  const viewIndexByType: Partial<Record<WalletType, number>> = {
    [WalletType.LEDGER]: 1,
    [WalletType.TREZOR]: 2,
    [WalletType.MNEMONIC]: 4,
  }

  const index =
    currentWalletType !== undefined &&
    viewIndexByType[currentWalletType] !== undefined
      ? (viewIndexByType[currentWalletType] as number)
      : 0

  setCurrentView(ACCESS_WALLET_VIEWS[index])
  emit('close')
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: 'WalletCard_SwitchAddress',
  })
  openAccessDialog()
}
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
