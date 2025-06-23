<template>
  <app-dialog
    :title="$t('verify-tx.title')"
    v-model:is-open="openModal"
    class="sm:max-w-[600px] sm:mx-auto"
    has-content-gutter
  >
    <template #content>
      <div class="flex flex-col gap-2 xs:gap-3">
        <div class="text-info text-s-17">
          {{ $t('verify-tx.description') }}
        </div>
        <div class="flex flex-col gap-1 xs:gap-2 text-wrap break-all">
          <!-- Network -->
          <div
            class="bg-mewBg border-1 border-blue-10 rounded-16 px-4 py-2 xs:py-3 flex items-start"
          >
            <img
              :src="selectedChain?.icon || '@/assets/icons/tokens/eth.svg'"
              alt=""
              class="w-9 h-9 mr-3 overflow-hidden shadow-token rounded-full bg-white bg-white p-[1px]"
            />
            <div>
              <p
                class="text-s-11 font-bold uppercase leading-p-130 tracking-sp-06 text-info"
              >
                {{ $t('common.network') }}
              </p>
              <p class="text-s-17">
                {{ selectedChain?.nameLong || $t('verify-tx.unkown-network') }}
              </p>
            </div>
          </div>
          <!-- From-->
          <div
            class="bg-mewBg border-1 border-blue-10 rounded-16 px-4 py-2 xs:py-3 flex flex-col"
          >
            <p
              class="text-s-11 font-bold uppercase leading-p-130 tracking-sp-06 text-info ml-12"
            >
              {{ $t('common.from') }}
            </p>

            <div class="flex items-center">
              <img
                alt=""
                :src="createIcon(fromAddress)"
                class="w-9 h-9 mr-3 rounded-full overflow-hidden shadow-token bg-white p-[1px] flex-none"
              />
              <p class="text-s-17">{{ fromAddress }}</p>
            </div>
          </div>
          <!-- Token Amount-->
          <div
            class="bg-mewBg border-1 border-blue-10 rounded-16 px-4 py-2 xs:py-3 flex flex-col"
          >
            <p
              class="text-s-11 font-bold uppercase leading-p-130 tracking-sp-06 text-info ml-12 mb-1"
            >
              {{ $t('common.amount') }}
            </p>
            <div class="flex items-center">
              <img
                alt=""
                :src="toToken.logo_url"
                class="w-9 h-9 mr-3 overflow-hidden shadow-token rounded-full bg-white p-[1px]"
              />
              <div>
                <p class="text-s-17 leading-p-120">
                  {{ toAmount }}
                  <span class="text-s-14">{{ toToken.symbol }}</span>
                </p>
                <p class="text-info text-s-14 leading-p-120">
                  ${{ toAmountFiat }}
                </p>
              </div>
            </div>
          </div>
          <!-- To -->
          <div
            class="bg-mewBg border-1 border-blue-10 rounded-16 px-4 py-2 xs:py-3 flex flex-col"
          >
            <p
              class="text-s-11 font-bold uppercase leading-p-130 tracking-sp-06 text-info ml-12"
            >
              {{ $t('common.to') }}
            </p>

            <div class="flex items-center">
              <img
                alt=""
                :src="createIcon(toAddress)"
                class="w-9 h-9 mr-3 rounded-full overflow-hidden shadow-token bg-white p-[1px] flex-none"
              />
              <p class="text-s-17">{{ toAddress }}</p>
            </div>
          </div>

          <!-- Network fee -->
          <div class="px-4 py-2 flex items-start justify-between">
            <p class="text-s-11 font-bold uppercase leading-[24px] text-info">
              {{ $t('common.network_fee') }}
            </p>
            <div class="text-right">
              <p>{{ formatFee }} {{ network?.currencyName }}</p>
              <p class="text-s-14 text-info">${{ networkFeeUSD }}</p>
            </div>
          </div>
          <button
            v-if="getDetails()"
            class="rounded-full hoverNoBG py-2 px-3 flex items-center justify-center max-w-fit mr-auto -mt-2"
            @click="showMoreDetails = !showMoreDetails"
          >
            {{ $t('common.more_details') }}
            <chevron-down-icon
              :class="[
                'transition-transform w-4 h-4 ml-2',
                { 'rotate-180': showMoreDetails },
              ]"
            />
          </button>
          <expand-transition>
            <div v-if="showMoreDetails && txDataFormatted !== null">
              <div
                class="my-2 flex flex-col gap-2 border-1 border-grey-outline py-3 rounded-16"
              >
                <!-- Nonce-->
                <div class="px-4 flex items-start justify-between">
                  <p
                    class="basis-3/12 text-s-11 font-bold uppercase leading-[24px] text-info"
                  >
                    {{ $t('common.nonce') }}
                  </p>
                  <p class="text-right basis-9/12">
                    {{ txDataFormatted.nonce }}
                  </p>
                </div>
                <!-- Gas Limit -->
                <div class="px-4 flex items-start justify-between">
                  <p
                    class="basis-3/12 text-s-11 font-bold uppercase leading-[24px] text-info"
                  >
                    Gas Limit
                  </p>
                  <p class="text-right basis-9/12">
                    {{ txDataFormatted.gasLimit }}
                  </p>
                </div>
                <!-- Max fee per gas -->
                <div
                  v-if="txDataFormatted.maxFeePerGas"
                  class="px-4 flex items-start justify-between"
                >
                  <p
                    class="basis-3/12 text-s-11 font-bold uppercase leading-[24px] text-info"
                  >
                    Max Fee per Gas
                  </p>
                  <p class="text-right basis-9/12">
                    {{ txDataFormatted.maxFeePerGas }} Gwei
                  </p>
                </div>
                <!-- Max fee per gas -->
                <div
                  v-if="txDataFormatted.maxPriorityFeePerGas"
                  class="px-4 flex items-start justify-between"
                >
                  <p
                    class="basis-3/12 text-s-11 font-bold uppercase leading-[24px] text-info"
                  >
                    Max Priority Fee per Gas
                  </p>
                  <p class="text-right basis-9/12">
                    {{ txDataFormatted.maxPriorityFeePerGas }} Gwei
                  </p>
                </div>
                <!-- Gas Price -->

                <div
                  v-if="txDataFormatted.gasPrice"
                  class="px-4 flex items-start justify-between"
                >
                  <p
                    class="basis-3/12 text-s-11 font-bold uppercase leading-[24px] text-info"
                  >
                    Gas Price
                  </p>
                  <p class="text-right basis-9/12">
                    {{ txDataFormatted.gasPrice }} Gwei
                  </p>
                </div>
                <!-- Data -->
                <div class="px-4 flex items-start justify-between">
                  <p
                    class="basis-3/12 text-s-11 font-bold uppercase leading-[24px] text-info"
                  >
                    {{ $t('common.data') }}
                  </p>
                  <p class="text-right basis-9/12">
                    {{ txDataFormatted.data }}
                  </p>
                </div>
              </div>
            </div>
          </expand-transition>
          <div
            class="flex align-center justify-center mt-2 mb-8 gap-3 xs:mx-10"
          >
            <app-base-button
              @click="goBack"
              is-outline
              class="min-w-[130px] xs:w-full"
            >
              {{ $t('common.back') }}
            </app-base-button>
            <app-base-button
              :is-loading="signing"
              @click="confirmTransaction"
              class="xs:w-full"
            >
              {{ $t('verify-tx.confirm') }}
            </app-base-button>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed } from 'vue'
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
import {
  formatFloatingPointValue,
  formatIntegerToString,
} from '@/utils/numberFormatHelper'
import { type HexPrefixedString } from '@/providers/types'
import { WalletType } from '@/providers/types'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { commonGenerator } from '@/providers/ethereum/utils'
import { Hardfork } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { fromWei } from 'web3-utils'

interface EvmTxType {
  toAddress: string
  networkFeeUSD: string
  networkFeeCrypto: string
  fromAddress: string
  network: Chain | null
  toToken: TokenBalanceRaw
  toAmount: string
  toAmountFiat: string
  signedTx: HexPrefixedString | string // rawTx may be different,
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
  //TO: show message that wallet is not connected
  if (!wallet.value) {
    return
  }
  signing.value = true
  const txPromise =
    wallet.value?.getWalletType() === WalletType.WAGMI ||
    wallet.value?.getWalletType() === WalletType.INJECTED
      ? wallet.value?.SendTransaction?.(props.signedTx as HexPrefixedString)
      : wallet.value.broadcastTransaction(props.signedTx as HexPrefixedString)
  // TODO: handle hash for user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await txPromise?.then(hash => {
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

const formatFee = computed(() => {
  return formatFloatingPointValue(props.networkFeeCrypto).value
})

/** ------------------------------
 * More details
 ------------------------------*/

const showMoreDetails = ref(false)

/**
 * Get transaction details from the signed transaction.
 * It tries to parse the transaction as an EIP-1559 transaction first,
 * and if it fails, it assumes it's a legacy transaction.
 * @returns {FeeMarketEIP1559Transaction | LegacyTransaction | null} The transaction details or null if the chain is not selected.
 */
const getDetails = () => {
  if (selectedChain.value && selectedChain.value.chainID) {
    //evm Only
    const chainId = selectedChain.value.chainID
    const serializedTx = props.signedTx
    try {
      const common = commonGenerator(BigInt(chainId), Hardfork.London)
      const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
        hexToBytes(serializedTx),
        { common },
      )
      console.log('EIP-1559 Transaction:', tx)
      return tx

      // on fail, assume legacy tx
    } catch {
      const common = commonGenerator(BigInt(chainId), Hardfork.Berlin)
      const tx = LegacyTransaction.fromSerializedTx(hexToBytes(serializedTx), {
        common,
      })
      console.log('Legacy Transaction:', tx)
      return tx
    }
  }
  return null
}

/**
 * Formats the transaction data for display.
 * It extracts the data, nonce, gas limit, and gas price or max fee per gas
 * from the transaction details and formats them for display.
 * @returns {object | null} An object containing the formatted transaction data or null if details are not available.
 */
const txDataFormatted = computed(() => {
  const details = getDetails()
  if (!details) return null
  if (details.type === 2) {
    const _details = details as FeeMarketEIP1559Transaction
    return {
      data: `0x${Buffer.from(_details.data).toString('hex')}`,
      nonce: _details.nonce.toString(),
      gasLimit: formatIntegerToString(_details.gasLimit.toString()),
      maxFeePerGas: formatFloatingPointValue(
        fromWei(_details.maxFeePerGas, 'gwei'),
      ).value,
      maxPriorityFeePerGas: formatFloatingPointValue(
        fromWei(_details.maxPriorityFeePerGas, 'gwei'),
      ).value,
    }
  }
  const _details = details as LegacyTransaction
  return {
    data: `0x${Buffer.from(_details.data).toString('hex')}`,
    nonce: _details.nonce.toString(),
    gasLimit: formatIntegerToString(_details.gasLimit.toString()),
    gasPrice: formatFloatingPointValue(
      fromWei(_details.gasPrice.toString(), 'gwei'),
    ).value,
  }
})
</script>
