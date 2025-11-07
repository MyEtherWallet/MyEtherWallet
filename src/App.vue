<template>
  <div class="relative">
    <welcome-dialog
      v-if="!isDevMode"
      @close-welcome-dialog="showFeedbackToast"
    />
    <the-app-layout v-if="isLoadingComplete" :aria-hidden="isAreaHidden" />
    <module-toast />
    <module-access-wallet v-if="isLoadingComplete" :aria-selected="true" />
  </div>
</template>

<script setup lang="ts">
import TheAppLayout from '@components/core_layouts/TheAppLayout.vue'
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
import WelcomeDialog from '@/components/core_layouts/WelcomeDialog.vue'
import ModuleAccessWallet from '@/modules/access/ModuleAccessWallet.vue'
import configs from './configs'
import { useDialogStore } from '@/stores/dialogStore'
import { useTimeoutFn } from '@vueuse/core'

import useBalanceHandler from './utils/balanceHandler'

const dialogStore = useDialogStore()
const { isAreaHidden } = storeToRefs(dialogStore)

const isDevMode = configs.IS_DEV_MODE
const store = useWalletStore()
const { wallet, walletAddress, isWalletConnected, hasMissingBalances } =
  storeToRefs(store)
const chainStore = useChainsStore()
const { selectedChain } = storeToRefs(chainStore)
const { setTokens, setIsLoadingBalances } = store
const isLoadingComplete = ref(false)

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
    } else {
      setTokens([])
      setIsLoadingBalances(false)
    }
  },
  { immediate: true },
)

const providerStore = useProviderStore()
const { addProvider } = providerStore
const { setChainData } = chainStore

const { useMEWFetch } = useFetchMewApi()
const { data, onFetchResponse } = useMEWFetch('/chains').get().json<ChainsRaw>()

onFetchResponse(() => {
  setChainData(data.value?.result || [])
  isLoadingComplete.value = true
  return data.value?.result || []
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

const showFeedbackToast = () => {
  setTimeout(() => {
    toastStore.addToastMessage({
      text: 'Your opinion matters!',
      textSecondary: 'Let us know what you think of this new version of MEW. ',
      type: ToastType.Info,
      isInfinite: true,
      link: {
        title: 'Submit Feedback',
        url: 'https://mewwallet.typeform.com/to/WtgSdMJr',
        isButton: true,
      },
    })
  }, 4000)
}
onMounted(() => {
  window.addEventListener('eip6963:announceProvider', (event: Event) => {
    const customEvent = event as CustomEvent
    const provider = customEvent.detail
    addProvider(provider)
  })
})
</script>
