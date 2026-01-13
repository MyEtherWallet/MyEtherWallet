<template>
  <div>
    <app-dialog
      v-if="isWalletConnected"
      v-model:is-open="openDialog"
      :title="isWatchOnly ? $t('watch_only_wallet') : $t('connected_wallet')"
      class="xs:max-w-[428px] sm:mx-auto"
    >
      <template #content>
        <div class="px-6 pt-2 pb-6">
          <div v-if="walletAddress" class="flex items-center">
            <app-blockie
              :address="walletAddress"
              :size="10"
              class="flex-none rounded-full"
            />
            <div class="ml-4 flex-1 flex items-center justify-between min-w-0">
              <p class="font-bold text-s-20 truncate mr-2">
                {{ truncateAddress(walletAddress, 10, 10) }}
              </p>
              <div class="flex items-center -mr-2">
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
                  class="rounded-full !cursor-pointer min-w-10 h-10 flex items-center justify-center hoverNoBG"
                >
                  <ArrowTopRightOnSquareIcon class="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <div
              v-if="!isLoadingBalances"
              class="flex items-center gap-1 min-h-[48px]"
            >
              <p class="font-bold text-s-40 leading-none">
                {{ formattedTotalFiatPortfolioValue }}
              </p>
              <!-- Update balances -->
              <app-btn-icon
                :label="$t('refresh_balance')"
                class="!inline"
                @click="fetchBalances"
              >
                <ArrowPathIcon class="w-6 h-6 text-primary" />
              </app-btn-icon>
            </div>
            <div
              v-else
              class="animate-pulse bg-grey-10 rounded-full w-[150px] min-h-[48px] mb-1"
            ></div>
            <p v-if="!isLoadingBalances" class="text-info text-s-16">
              {{ formattedBalance }} {{ mainTokenBalance?.symbol || '' }}
              {{ $t('common.and') }} {{ tokensCount }}
            </p>
            <div
              v-else
              class="animate-pulse bg-grey-10 rounded-full w-[180px] min-h-6"
            ></div>
          </div>
          <!-- Actions -->
          <div class="mt-6 grid grid-cols-5 gap-1.5 focus:outline-none">
            <button
              class="rounded-16 bg-mewBg flex flex-col items-center justify-center min-h-[72px] hoverNoBG"
              @click="openDeposit"
            >
              <QrCodeIcon class="w-7 h-7 text-primary mb-1" />
              <p class="text-s-12 font-medium">{{ $t('deposit') }}</p>
            </button>
            <button
              class="rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG"
              @click.stop.prevent="openWalletMenu('buy')"
            >
              <icon-buy class="w-7 h-7 text-primary mb-1" />
              <p class="text-s-12 font-medium">{{ $t('buy') }}</p>
            </button>
            <button
              class="rounded-16 bg-mewBg flex flex-col items-center justify-center p-2 hoverNoBG"
              @click.stop.prevent="openWalletMenu('sell')"
            >
              <icon-sell class="w-7 h-7 text-primary mb-1" />
              <p class="text-s-12 font-medium">{{ $t('sell') }}</p>
            </button>
            <button
              class="rounded-16 bg-mewBg flex flex-col items-center justify-center p-2 hoverNoBG"
              @click.stop.prevent="openWalletMenu('send')"
            >
              <icon-send class="w-7 h-7 text-primary mb-1" />
              <p class="text-s-12 font-medium">{{ $t('common.send') }}</p>
            </button>
            <button
              class="rounded-16 bg-mewBg flex flex-col items-center justify-center p-2 hoverNoBG"
              @click.stop.prevent="openWalletMenu('swap')"
            >
              <icon-swap class="w-7 h-7 text-primary mb-1" />
              <p class="text-s-12 font-medium">{{ $t('common.swap') }}</p>
            </button>
          </div>
          <button
            class="shadow-button shadow-button-elevated rounded-16 p-4 mt-6 hoverNoBG w-full"
            @click="openPaperWalletDialog = true"
          >
            <p class="text-s-16 font-medium">{{ $t('view_paper_wallet') }}</p>
          </button>
          <button
            v-if="canSwitchAddress"
            class="shadow-button shadow-button-elevated rounded-16 p-4 mt-3 hoverNoBG w-full"
            @click="switchAddress"
          >
            <p class="text-s-16 font-medium">
              {{ $t('switch_connected_address') }}
            </p>
          </button>
          <div class="flex items-center justify-center mt-6" v-if="isWatchOnly">
            <app-base-button is-outline size="large" @click="openAccess">
              {{ $t('connect_wallet') }}</app-base-button
            >
          </div>
          <div class="flex items-center justify-center mt-3">
            <app-base-button
              theme="error"
              is-outline
              size="large"
              @click="disconnectWallet"
            >
              {{
                isWatchOnly
                  ? $t('delete_watch_only_wallet')
                  : $t('disconnect_wallet')
              }}</app-base-button
            >
          </div>
        </div>
      </template>
    </app-dialog>
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
    <the-paper-wallet v-model:is-open="openPaperWalletDialog" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSell from '@/assets/icons/core_menu/icon-sell.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import TheDepositDialog from '@/components/core_layouts/wallet/TheDepositDialog.vue'
import ThePaperWallet from './ThePaperWallet.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import {
  QrCodeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { useChainsStore } from '@/stores/chainsStore'
import { type WalletPanel, useWalletMenuStore } from '@/stores/walletMenuStore'
import { WalletType } from '@/providers/types'
import { useAccessStore } from '@/stores/accessStore'
import { WALLET_VIEWS } from '@/modules/access/common/walletConfigs'
import { useRecentAddressStore } from '@/stores/recentAddressStore'
import useBalanceHandler from '@/utils/balanceHandler'
import { truncateAddress } from '@/utils/filters'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
const store = useWalletStore()
const { setTokens, setIsLoadingBalances } = store

const {
  wallet,
  isWalletConnected,
  walletAddress,
  formattedTotalFiatPortfolioValue,
  formattedBalance,
  mainTokenBalance,
  tokens,
  isLoadingBalances,
  isWatchOnly,
} = storeToRefs(store)

/** -------------------------------
 * Dialog
 -------------------------------*/

const openPaperWalletDialog = ref(false) //paper wallet dialog
const openDepositDialog = ref(false) //deposit dialog

const openDialog = defineModel<boolean>('openDialog', {
  default: false,
})

const { t } = useI18n()

const tokensCount = computed(() => {
  const length = tokens.value.length

  switch (length) {
    case 0:
      return t('common.token_count', 0)
    case 1:
      return t('common.token_count', 1)
    default:
      return t('common.token_count', { count: length })
  }
})

// Switch Address
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

const openAccess = () => {
  openAccessDialog()
  closeDialog()
}

const accessStore = useAccessStore()
const { setCurrentView, openAccessDialog } = accessStore
const switchAddress = () => {
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

  setCurrentView(WALLET_VIEWS[index])
  closeDialog()
  openAccessDialog()
}

/** -------------------------------
 * Actions
 -------------------------------*/
const openWalletMenu = (walletPanel: WalletPanel) => {
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
  walletMenu.setWalletPanel(walletPanel)
  closeDialog()
}
const disconnectWallet = () => {
  if (isWatchOnly.value) {
    // add delete watch only wallet here
    const recentAddressStore = useRecentAddressStore()
    recentAddressStore.removeWallet(
      walletAddress.value as string,
      selectedChain.value!,
    )
    openDialog.value = false
  }
  store.removeWallet()
  openDialog.value = false
}

const fetchBalances = () => {
  setIsLoadingBalances(true)
  wallet.value?.getBalance().then(balances => {
    useBalanceHandler(balances, setTokens, setIsLoadingBalances)
  })
}
const closeDialog = () => {
  openDialog.value = false
}

const openDeposit = () => {
  openDepositDialog.value = true
}

/** -------------------------------
 * Explorer Link
 -------------------------------*/
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const getExplorerLink = computed(() => {
  return selectedChain.value?.blockExplorerAddr.replace(
    '[[address]]',
    walletAddress.value || '',
  )
})
</script>
