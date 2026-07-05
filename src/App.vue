<template>
  <div class="relative h-screen overflow-hidden">
    <!-- <welcome-dialog v-if="!isDevMode" /> -->
    <weekend-trading-dialog v-if="isLoadingComplete" />
    <rwa-announcement-dialog v-if="isLoadingComplete" />
    <the-app-layout v-if="isLoadingComplete" :aria-hidden="isAreaHidden" />
    <module-toast />
    <module-access-wallet v-if="isLoadingComplete" :aria-selected="true" />
    <module-create-wallet v-if="isLoadingComplete" :aria-selected="true" />
    <the-gdpr-banner v-if="isLoadingComplete" :aria-hidden="isAreaHidden" />
    <app-mew-wallet-banner v-if="false" />
  </div>
</template>

<script setup lang="ts">
import TheAppLayout from '@components/core_layouts/TheAppLayout.vue'
import TheGdprBanner from '@components/core_layouts/TheGdprBanner.vue'
import ModuleToast from './modules/toast/ModuleToast.vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type ChainsRaw, type TokenBalancesRaw } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useProviderStore } from '@/stores/providerStore'
import { onMounted, watch, ref } from 'vue'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
// import WelcomeDialog from '@/components/core_layouts/WelcomeDialog.vue'
import WeekendTradingDialog from '@/components/core_layouts/WeekendTradingDialog.vue'
import RwaAnnouncementDialog from '@/modules/rwa_rewards/RwaAnnouncementDialog.vue'
import ModuleAccessWallet from '@/modules/access/ModuleAccessWallet.vue'
import ModuleCreateWallet from '@/modules/create/ModuleCreateWallet.vue'
import AppMewWalletBanner from '@/components/AppMewWalletBanner.vue'
import configs from './configs'
import { useDialogStore } from '@/stores/dialogStore'
import { useTimeoutFn } from '@vueuse/core'
import { usePurchaseStore } from '@/stores/purchaseStore'
import useBalanceHandler from './utils/balanceHandler'
import { useStocksStore } from '@/stores/stocksStore'
import { useSwap } from '@/composables/useSwap'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { analytics } from '@/analytics'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
} from '@/stores/tradeOrdersStore'
import Intercom from '@intercom/messenger-js-sdk'
import { useMarketStatus } from './modules/trade/composables'
const { fetchMarketStatus } = useMarketStatus()

const dialogStore = useDialogStore()
const { isAreaHidden } = storeToRefs(dialogStore)

const purchaseStore = usePurchaseStore()
const { fetchPurchaseInfo } = purchaseStore

const stocksStore = useStocksStore()
const { fetchStocksAddresses } = stocksStore

// const isDevMode = configs.IS_DEV_MODE
const store = useWalletStore()
const {
  wallet,
  walletAddress,
  isWalletConnected,
  hasMissingBalances,
  userProperties,
} = storeToRefs(store)
const chainStore = useChainsStore()
const holdingsStore = useHoldingsStore()
const { initSwapper } = useSwap()
const { selectedChain } = storeToRefs(chainStore)
const { setTokens, setIsLoadingBalances } = store
const isLoadingComplete = ref(false)

const popupStore = useAnalyticsStore()
const { consent } = storeToRefs(popupStore)
watch(
  () => consent.value,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      analytics.setUserProperties({
        ...userProperties.value,
        network: selectedChain.value?.name,
      })
    }
  },
)

const { isPending, start, stop } = useTimeoutFn(() => {
  fetchBalances()
}, 300000)

const fetchBalances = () => {
  setIsLoadingBalances(true)
  stop()
  wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
    useBalanceHandler(balances, setTokens, setIsLoadingBalances)
    if (hasMissingBalances.value) {
      // Refetch balances after 5 minutes if there are missing balances
      setTimeout(() => {
        toastStore.addToastMessage({
          text: 'Sit tight!',
          textSecondary:
            "We are processing more tokens in your wallet. We'll update your balances soon.",
          type: ToastType.Info,
          duration: 300000,
        })
      }, 2000)
      if (isPending.value) {
        stop()
      }
      start()
    }
  })
}

watch(
  () => walletAddress.value,
  newWallet => {
    if (newWallet) {
      fetchBalances()
      holdingsStore.startPolling(newWallet)
    } else {
      setTokens([])
      setIsLoadingBalances(false)
      holdingsStore.stopPolling()
    }
  },
  { immediate: true },
)

const providerStore = useProviderStore()
const { addProvider } = providerStore
const { setChainData } = chainStore

const { useMEWFetch } = useFetchMewApi()
const { data, onFetchResponse } = useMEWFetch('/v1/chains/with-prices')
  .get()
  .json<ChainsRaw>()

onFetchResponse(() => {
  setChainData(data.value ?? [])
  isLoadingComplete.value = true
  return data.value ?? []
})

watch(
  () => selectedChain.value,
  newChain => {
    if (newChain && isWalletConnected.value) {
      if (newChain.chainID) {
        wallet.value?.updateChainId(newChain.chainID)
      }
      fetchBalances()
    } else {
      setTokens([])
      setIsLoadingBalances(false)
    }
  },
  { immediate: true },
)
/**-------------------------------
 * Toast Feedback
 -------------------------------*/

const toastStore = useToastStore()

// const showFeedbackToast = () => {
//   setTimeout(() => {
//     toastStore.addToastMessage({
//       text: 'Your opinion matters!',
//       textSecondary: 'Let us know what you think of this new version of MEW. ',
//       type: ToastType.Info,
//       isInfinite: true,
//       link: {
//         title: 'Submit Feedback',
//         url: 'https://mewwallet.typeform.com/to/WtgSdMJr',
//         isButton: true,
//       },
//     })
//   }, 4000)
// }
const rewardsStore = useRewardsStore()
const tradeOrdersStore = useTradeOrdersStore()

onMounted(() => {
  fetchMarketStatus()
  fetchPurchaseInfo()
  fetchStocksAddresses()
  rewardsStore.fetchAll()
  tradeOrdersStore.subscribe((item, type) => {
    if (type !== 'order') return
    const order = item as SavedTradeOrder
    if (order.hash && order.chainId != null) {
      holdingsStore.register(order.hash, order.chainId)
    }
  })
  window.addEventListener('eip6963:announceProvider', (event: Event) => {
    const customEvent = event as CustomEvent
    const provider = customEvent.detail
    addProvider(provider)
  })
  initSwapper()
  if (configs.INTERCOM_APP_ID) {
    Intercom({
      app_id: configs.INTERCOM_APP_ID,
      hide_default_launcher: false,
      horizontal_padding: 90, // distance from side
      vertical_padding: 20, // distance from bottom
    })
  }
})
</script>
