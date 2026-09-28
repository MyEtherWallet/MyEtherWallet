<template>
  <div
    class="relative h-screen overflow-hidden"
    :inert="isAreaHidden || undefined"
  >
    <!-- <welcome-dialog v-if="!isDevMode" /> -->
    <!-- 24/7 announcement dialog disabled; only the tooltip is used, gated to
         show 3 days after the RWA announcement is closed -->
    <!-- <weekend-trading-dialog v-if="isLoadingComplete" /> -->
    <!-- Trade & Hold campaign announcement disabled. NOTE: this was the last
         component calling `useMarketStatus().fetchTradingRestriction()`, which
         is the only writer of `globalStore.isTradingRestrictedInRegion` — see
         the comment in globalStore for what that means for readers. -->
    <!-- <rwa-announcement-dialog v-if="isLoadingComplete" /> -->
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
import { useI18n } from 'vue-i18n'
import { ToastType } from '@/types/notification'
// import WelcomeDialog from '@/components/core_layouts/WelcomeDialog.vue'
// import WeekendTradingDialog from '@/components/core_layouts/WeekendTradingDialog.vue'
// import RwaAnnouncementDialog from '@/modules/rwa_rewards/RwaAnnouncementDialog.vue'
import ModuleAccessWallet from '@/modules/access/ModuleAccessWallet.vue'
import ModuleCreateWallet from '@/modules/create/ModuleCreateWallet.vue'
import AppMewWalletBanner from '@/components/AppMewWalletBanner.vue'
import configs from './configs'
import { useDialogStore } from '@/stores/dialogStore'
import { useTimeoutFn } from '@vueuse/core'
import { usePurchaseStore } from '@/stores/purchaseStore'
import useBalanceHandler from './utils/balanceHandler'
import { useStocksStore } from '@/stores/stocksStore'
import { useSwapStore } from '@/stores/swapStore'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { analytics } from '@/analytics'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'
import {
  useTradeOrdersStore,
  type SavedTradeOrder,
} from '@/stores/tradeOrdersStore'
import Intercom from '@intercom/messenger-js-sdk'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
// One-shot warm-up: with no consumer acquired, this updates state and
// schedules nothing (polling is refcounted by the surfaces that need it).
const { fetchMarketStatus } = useMarketStatusStore()

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
  isWalletUnlocked,
  isConnectingWallet,
  hasMissingBalances,
  userProperties,
} = storeToRefs(store)
const chainStore = useChainsStore()
const holdingsStore = useHoldingsStore()
useSwapStore()
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

// Fetches requested in the same turn collapse into one request: a connect sets
// the wallet object, resolves its address a microtask later, and may switch the
// network alongside — each of which used to fire the (rate limited) balances
// endpoint. Only the newest request's result is applied.
let balanceFetchTimer: ReturnType<typeof setTimeout> | null = null
let balanceFetchGeneration = 0
const fetchBalances = () => {
  if (balanceFetchTimer) return
  balanceFetchTimer = setTimeout(() => {
    balanceFetchTimer = null
    runFetchBalances()
  }, 0)
}

const runFetchBalances = () => {
  const generation = ++balanceFetchGeneration
  if (!walletAddress.value) {
    setIsLoadingBalances(false)
    return
  }
  setIsLoadingBalances(true)
  stop()
  wallet.value
    ?.getBalance()
    .then((balances: TokenBalancesRaw) => {
      if (generation !== balanceFetchGeneration) return
      useBalanceHandler(balances, setTokens, setIsLoadingBalances)
      if (hasMissingBalances.value) {
        // Refetch balances after 5 minutes if there are missing balances
        setTimeout(() => {
          toastStore.addToastMessage({
            text: t('common.processing_tokens_title'),
            textSecondary: t('common.processing_tokens_description'),
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
    .catch((error: unknown) => {
      if (generation !== balanceFetchGeneration) return
      if (import.meta.env.DEV) console.error('Balance fetch failed:', error)
      setIsLoadingBalances(false)
      // Keep the retry loop alive: a transient failure shouldn't permanently
      // stop the timer when balances are still missing from a prior load.
      if (hasMissingBalances.value) {
        start()
      }
    })
}

// Balances follow the wallet object as well as its address: connecting a signing
// wallet over a watch-only one keeps the address but swaps the wallet (and often
// the network), and that swap is what must trigger the refetch.
watch(
  [walletAddress, wallet],
  ([address]) => {
    if (address) {
      fetchBalances()
    } else {
      setTokens([])
      setIsLoadingBalances(false)
    }
  },
  { immediate: true },
)

watch(
  () => walletAddress.value,
  newWallet => {
    if (newWallet) holdingsStore.startPolling(newWallet)
    else holdingsStore.stopPolling()
  },
  { immediate: true },
)

// Seed the reward campaign's season data on first load. Runs after the watcher
// above so a restored session has already started its address-scoped poll — the
// store then skips this, since that poll returns the same season block plus the
// wallet's buckets. Only a visitor with no wallet yet actually fetches here.
holdingsStore.fetchCampaignInfo()

// Logging in from a watch-only address keeps the same `walletAddress`, so the
// watcher above never fires — refetch reward info on the unlock itself, so it
// reflects the address that can actually claim.
watch(isWalletUnlocked, unlocked => {
  if (unlocked && walletAddress.value)
    holdingsStore.fetchInfo(walletAddress.value)
})

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
    // A connect flow is landing a wallet on this chain (it sets the network,
    // then setWallet resolves): the wallet watcher above fetches once for it,
    // so don't also fetch for the wallet that is about to be replaced.
    if (isConnectingWallet.value) return
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
const { t } = useI18n()

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
      holdingsStore
        .register(order.hash, order.chainId, order.usdValue)
        .then(registered => {
          if (!registered) return
          tradeOrdersStore.updateOrder(order.fromAddress, order.hash, {
            rewardRegistered: true,
          })
        })
    }
  })
  window.addEventListener('eip6963:announceProvider', (event: Event) => {
    const customEvent = event as CustomEvent
    const provider = customEvent.detail
    addProvider(provider)
  })
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
