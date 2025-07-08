<template>
  <app-dialog
    v-if="isWalletConnected"
    v-model:is-open="openDialog"
    :title="$t('connected_wallet')"
    class="xs:max-w-[428px] sm:mx-auto"
  >
    <template #content>
      <div class="p-5 xs:px-6 pt-2s pb-5">
        <div v-if="walletAddress" class="flex items-center">
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
        <div class="mt-4">
          <p v-if="!isLoadingBalances" class="font-semibold text-s-32 h-[42px]">
            {{ formattedTotalFiatPortflioValue }}
            <!-- Update balances -->
            <app-btn-icon
              :label="$t('refresh_balance')"
              class="!inline"
              @click="fetchBalances"
            >
              <ArrowPathIcon class="text-primary" />
            </app-btn-icon>
          </p>
          <div
            v-else
            class="animate-pulse bg-grey-10 rounded-full w-[150px] min-h-[39px] mb-[3px]"
          ></div>
          <p v-if="!isLoadingBalances" class="text-info">
            {{ formattedBalance }} {{ mainTokenBalance?.symbol || '' }}
            {{ $t('common.and') }} {{ tokensCount }}
          </p>
          <div
            v-else
            class="animate-pulse bg-grey-10 rounded-full w-[180px] min-h-6"
          ></div>
        </div>
        <!-- Actions -->
        <div class="mt-4 grid grid-cols-4 gap-1">
          <button
            class="rounded-16 bg-mewBg flex flex-col items-center justify-center min-h-[72px] hoverNoBG"
          >
            <QrCodeIcon class="w-7 h-7 text-primary mb-1" />
            <p class="text-s-12">{{ $t('deposit') }}</p>
          </button>
          <router-link
            :to="{ name: ROUTES_MAIN.BUY.NAME }"
            class="rounded-16 bg-mewBg flex flex-col items-center justify-center hoverNoBG"
          >
            <icon-buy class="w-7 h-7 text-primary mb-1" />
            <p class="text-s-12">{{ $t('buy-sell') }}</p>
          </router-link>
          <router-link
            :to="{ name: ROUTES_SEND.SEND.NAME }"
            class="rounded-16 bg-mewBg flex flex-col items-center justify-center p-2 hoverNoBG"
          >
            <icon-send class="w-7 h-7 text-primary mb-1" />
            <p class="text-s-12">{{ $t('common.send') }}</p>
          </router-link>
          <router-link
            :to="{ name: ROUTES_MAIN.SWAP.NAME }"
            class="rounded-16 bg-mewBg flex flex-col items-center justify-center p-2 hoverNoBG"
          >
            <icon-swap class="w-7 h-7 text-primary mb-1" />
            <p class="text-s-12">{{ $t('swap') }}</p>
          </router-link>
        </div>
        <button
          class="shadow-button shadow-button-elevated rounded-16 p-3 mt-6 hoverNoBG w-full"
        >
          <p class="text-s-14">{{ $t('view_paper_wallet') }}</p>
        </button>
        <button
          class="shadow-button shadow-button-elevated rounded-16 p-3 mt-3 hoverNoBG w-full"
        >
          <p class="text-s-14">{{ $t('switch_connected_address') }}</p>
        </button>
        <div class="flex items-center justify-center mt-6">
          <app-base-button
            theme="error"
            is-outline
            size="medium"
            @click="disconnectWallet"
          >
            {{ $t('disconnect_wallet') }}</app-base-button
          >
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import IconSend from '@/assets/icons/core_menu/icon-send.vue'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
// import AppBtnText from '@/components/AppBtnText.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import {
  QrCodeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { ROUTES_MAIN, ROUTES_SEND } from '@/router/routeNames'

const store = useWalletStore()
const { setTokens, setIsLoadingBalances } = store

const {
  wallet,
  isWalletConnected,
  walletAddress,
  formattedTotalFiatPortflioValue,
  formattedBalance,
  mainTokenBalance,
  tokens,
  isLoadingBalances,
} = storeToRefs(store)

/** -------------------------------
 * Dialog
 -------------------------------*/
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

const disconnectWallet = () => {
  store.removeWallet()
  openDialog.value = false
}

const fetchBalances = () => {
  setIsLoadingBalances(true)
  wallet.value?.getBalance().then(balances => {
    setTokens(balances.result)
    setIsLoadingBalances(false)
  })
}
</script>
