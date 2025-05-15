<template>
  <app-dialog
    title="Verify Transaction"
    v-model:is-open="openModal"
    class="sm:max-w-[600px] sm:mx-auto"
  >
    <template #content>
      <div class="px-6 pt-6">
        Double check the information and confirm the transaction.
      </div>
      <div class="px-6 py-6">
        <div class="border border-grey-30 border-b-0 rounded-t-lg p-4 flex">
          <!-- TODO: replace with actual network token from props later once networks are established -->
          <img
            :src="selectedChain?.icon || '@/assets/icons/tokens/eth.svg'"
            alt="Ethereum"
            class="w-10 h-10 mr-3"
          />
          <div>
            <p class="text-sm">Network</p>
            <p class="text-grey-50 font-semibold">
              {{ selectedChain?.nameLong || 'Unkown network' }}
            </p>
          </div>
        </div>

        <div class="border border-grey-30 border-b-0 p-4 flex">
          <img
            :src="createIcon(fromAddress)"
            class="w-10 h-10 mr-3 rounded-full"
          />
          <div>
            <p class="text-sm">From</p>
            <p class="text-lg">{{ fromAddress }}</p>
          </div>
        </div>

        <div class="border border-grey-30 border-b-0 p-4 flex">
          <img
            :src="createIcon(toAddress)"
            class="w-10 h-10 mr-3 rounded-full"
          />
          <div>
            <p class="text-sm">To</p>
            <p class="text-lg">{{ toAddress }}</p>
          </div>
        </div>

        <div class="border border-grey-30 border-b-0 p-4 flex items-center">
          <img :src="toToken.logo_url" class="w-10 h-10 mr-3 rounded-full" />
          <div>
            <p class="text-sm">Amount</p>
            <p class="text-lg">
              {{ toAmount }} <span class="text-sm">{{ toToken.symbol }}</span>
            </p>
            <p class="text-grey-50 text-sm">${{ toAmountFiat }}</p>
          </div>
        </div>

        <div class="border border-grey-30 rounded-b-lg p-4">
          <p>
            Network fee: ${{ networkFeeUSD }}
            <span class="text-grey-50 pl-3">
              ({{ networkFeeCrypto }} {{ network.name }})</span
            >
          </p>
        </div>
        <div class="flex align-center justify-center pb-4 pt-10">
          <app-base-button
            class="px-16 py-2 bg-grey-light rounded-lg"
            @click="goBack"
          >
            Back
          </app-base-button>
          <app-base-button
            class="px-16 ml-2 py-2 text-white bg-primary rounded-lg"
            :is-loading="signing"
            @click="confirmTransaction"
          >
            Confirm and send
          </app-base-button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import type { TokenBalanceRaw } from '@/mew_api/types'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import createIcon from '@/providers/ethereum/blockies'
import { useWalletStore } from '@/stores/walletStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification/index'
import { useChainsStore } from '@/stores/chainsStore'

import { type HexPrefixedString } from '@/providers/types'

interface EvmTxType {
  toAddress: string
  networkFeeUSD: string
  networkFeeCrypto: string
  fromAddress: string
  network: Chain
  toToken: TokenBalanceRaw
  toAmount: string
  toAmountFiat: string
  signedTx: HexPrefixedString // rawTx may be different
}

const props = defineProps<EvmTxType>()
const model = defineModel()

const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

// Modal settings
const openModal = ref(false)

watch(
  () => model.value,
  value => {
    openModal.value = !!value
  },
)

watch(
  () => openModal.value,
  value => {
    model.value = value
  },
)

// modal actions
const signing = ref(false)

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

const goBack = () => {
  openModal.value = false
  model.value = false
}
// Toast
const toastStore = useToastStore()

const confirmTransaction = async () => {
  signing.value = true

  wallet.value.broadcastTransaction(props.signedTx).then(() => {
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: 'Transaction sent successfully',
      duration: 10000,
    })
  })

  signing.value = false
  openModal.value = false
  model.value = false
}
</script>
