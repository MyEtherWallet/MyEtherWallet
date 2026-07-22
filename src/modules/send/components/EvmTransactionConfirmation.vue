<template>
  <app-dialog
    :title="$t('verify-tx.title')"
    v-model:is-open="openModal"
    class="sm:max-w-[600px] sm:mx-auto"
    has-content-gutter
  >
    <template #content>
      <!--TODO: add animation for tx completion and emit an event that tx was sent out -->
      <div class="flex flex-col gap-3 px-1">
        <div class="text-grey-70 text-s-15 text-center mb-1">
          {{ $t('verify-tx.description') }}
        </div>
        <expand-transition>
          <div v-if="showApproveMessage">
            <div
              class="flex items-center justify-center gap-5 my-4 font-bold text-primary animate-pulse"
              key="confirmation-approve-message"
            >
              {{ $t('send.approve-tx-on-device') }}
            </div>
          </div>
        </expand-transition>
        <div class="flex flex-col gap-2 text-wrap">
          <!-- Network -->
          <div
            class="bg-mewBg border-none rounded-20 px-5 py-4 flex items-center"
          >
            <img
              :src="selectedChain?.icon || '@/assets/icons/tokens/eth.svg'"
              alt=""
              class="w-10 h-10 mr-4 overflow-hidden shadow-token rounded-full bg-white p-0.5"
            />
            <div>
              <p
                class="text-s-11 font-bold uppercase leading-tight tracking-sp-06 text-info"
              >
                {{ $t('common.network') }}
              </p>
              <p class="text-s-17 font-medium text-black">
                {{ selectedChain?.nameLong || $t('verify-tx.unknown-network') }}
              </p>
            </div>
          </div>
          <!-- From-->
          <div
            class="bg-mewBg border-none rounded-20 px-5 py-4 flex flex-col gap-1"
          >
            <p
              class="text-s-11 font-bold uppercase leading-tight tracking-sp-06 text-info ml-14"
            >
              {{ $t('common.from') }}
            </p>

            <div class="flex items-center">
              <img
                alt=""
                :src="createIcon(fromAddress)"
                class="w-10 h-10 mr-4 rounded-full overflow-hidden shadow-token bg-white p-0.5 flex-none"
              />
              <p
                class="text-s-15 font-medium text-black break-all leading-relaxed"
              >
                {{ fromAddress }}
              </p>
            </div>
          </div>
          <!-- Token Amount-->
          <div
            class="bg-mewBg border-none rounded-20 px-5 py-4 flex flex-col gap-1"
          >
            <p
              class="text-s-11 font-bold uppercase leading-tight tracking-sp-06 text-info ml-14"
            >
              {{ $t('common.amount') }}
            </p>
            <div class="flex items-center">
              <img
                alt=""
                :src="toToken.logo_url || selectedChain?.icon"
                class="w-10 h-10 mr-4 overflow-hidden shadow-token rounded-full bg-white p-0.5"
              />
              <div class="grow">
                <p class="text-s-20 font-bold text-black leading-tight">
                  {{ toAmount }}
                  <span class="text-s-14 text-info">{{ toToken.symbol }}</span>
                </p>
                <p class="text-info text-s-14 font-medium">
                  ${{ toAmountFiat }}
                </p>
              </div>
            </div>
          </div>
          <!-- To -->
          <div
            class="bg-mewBg border-none rounded-20 px-5 py-4 flex flex-col gap-1"
          >
            <p
              class="text-s-11 font-bold uppercase leading-tight tracking-sp-06 text-info ml-14"
            >
              {{ $t('common.to') }}
            </p>

            <div class="flex items-center">
              <img
                alt=""
                :src="createIcon(toAddress)"
                class="w-10 h-10 mr-4 rounded-full overflow-hidden shadow-token bg-white p-0.5 flex-none"
              />
              <p
                class="text-s-15 font-medium text-black break-all leading-relaxed"
              >
                {{ toAddress }}
              </p>
            </div>
          </div>

          <!-- Network fee -->
          <div class="px-5 py-2 flex items-start justify-between mt-1">
            <p
              class="text-s-11 font-bold uppercase tracking-sp-06 text-info py-1"
            >
              {{ $t('common.network_fee') }}
            </p>
            <div class="text-right">
              <p class="font-bold text-s-15 text-black">
                {{ formatFee }} {{ network?.currencyName }}
              </p>
              <p class="text-s-12 font-medium text-info mt-0.5">
                ${{ networkFeeUSD }}
              </p>
            </div>
          </div>
          <button
            v-if="txDataFormatted"
            class="rounded-full hoverNoBG py-2 px-4 flex items-center justify-center max-w-fit mr-auto -mt-1 text-s-14 font-medium"
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
              <div class="my-2 flex flex-col gap-4 bg-mewBg py-6 rounded-20">
                <!-- Nonce-->
                <div class="px-5 flex items-center justify-between">
                  <p
                    class="text-s-11 font-bold uppercase tracking-sp-06 text-info"
                  >
                    {{ $t('common.nonce') }}
                  </p>
                  <p class="text-right text-s-14 font-medium text-black">
                    {{ txDataFormatted.nonce }}
                  </p>
                </div>
                <!-- Gas Limit -->
                <div class="px-5 flex items-center justify-between">
                  <p
                    class="text-s-11 font-bold uppercase tracking-sp-06 text-info"
                  >
                    {{ $t('gas.limit') }}
                  </p>
                  <p class="text-right text-s-14 font-medium text-black">
                    {{ txDataFormatted.gasLimit }}
                  </p>
                </div>
                <!-- Max fee per gas -->
                <div
                  v-if="txDataFormatted.maxFeePerGas"
                  class="px-5 flex items-center justify-between"
                >
                  <p
                    class="text-s-11 font-bold uppercase tracking-sp-06 text-info"
                  >
                    {{ $t('gas.max_fee') }}
                  </p>
                  <p class="text-right text-s-14 font-medium text-black">
                    {{ txDataFormatted.maxFeePerGas }} Gwei
                  </p>
                </div>
                <!-- Max Priority fee per gas -->
                <div
                  v-if="txDataFormatted.maxPriorityFeePerGas"
                  class="px-5 flex items-center justify-between"
                >
                  <p
                    class="text-s-11 font-bold uppercase tracking-sp-06 text-info"
                  >
                    {{ $t('gas.max_priority') }}
                  </p>
                  <p class="text-right text-s-14 font-medium text-black">
                    {{ txDataFormatted.maxPriorityFeePerGas }} Gwei
                  </p>
                </div>
                <!-- Gas Price -->

                <div
                  v-if="txDataFormatted.gasPrice"
                  class="px-5 flex items-center justify-between"
                >
                  <p
                    class="text-s-11 font-bold uppercase tracking-sp-06 text-info"
                  >
                    {{ $t('gas.price') }}
                  </p>
                  <p class="text-right text-s-14 font-medium text-black">
                    {{ txDataFormatted.gasPrice }} Gwei
                  </p>
                </div>
                <!-- Data -->
                <div class="px-5 flex items-start justify-between">
                  <p
                    class="text-s-11 font-bold uppercase tracking-sp-06 text-info pt-2"
                  >
                    {{ $t('common.data') }}
                  </p>
                  <div class="flex justify-end max-w-[70%]">
                    <p
                      class="text-right text-s-12 break-all font-mono bg-white px-3 py-2 rounded-lg text-black"
                    >
                      {{ txDataFormatted.data }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </expand-transition>
          <div class="flex align-center justify-center mt-6 mb-4 gap-4">
            <app-base-button @click="goBack" is-outline class="w-full">
              {{ $t('common.back') }}
            </app-base-button>
            <app-base-button
              :is-loading="signing"
              @click="confirmTransaction"
              class="w-full"
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
import { ref, watch, computed } from 'vue'
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
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
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
import { hexToBytes, bytesToHex } from '@ethereumjs/util'
import { fromWei } from 'web3-utils'
import { useI18n } from 'vue-i18n'
import {
  isSignableWallet,
  isUserRejectionError,
  getLocalizedWalletError,
} from '@/utils/walletUtils'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import {
  analytics,
  SendEvent,
  SendEventStatus,
  SendEventError,
} from '@/analytics'

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
const emit = defineEmits<{
  'tx-sent': [txHash: string]
}>()
const chainsStore = useChainsStore()
const tradeOrdersStore = useTradeOrdersStore()
const { selectedChain } = storeToRefs(chainsStore)

const showApproveMessage = ref(false)

// Modal settings
const openModal = ref(false)

watch(
  () => model.value,
  value => {
    openModal.value = !!value
    if (openModal.value) {
      analytics.trackSendEvent(SendEvent.CONFIRM_SHOWN, {
        token: props.toToken?.symbol,
      })
    }
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
const { t } = useI18n()

const sanitizeErrorMessage = (e: string) => {
  if (e.toLowerCase().includes('rejected'))
    return t('common.error.user_canceled_request')
  return e
}

const confirmTransaction = async () => {
  analytics.trackSendEvent(SendEvent.CONFIRM_PROCEED, {
    token: props.toToken?.symbol,
  })
  try {
    //TO: show message that wallet is not connected
    if (!wallet.value) {
      return
    }
    showApproveMessage.value = !(
      wallet.value?.getWalletType() === WalletType.PRIVATE_KEY ||
      wallet.value?.getWalletType() === WalletType.MNEMONIC
    )
    signing.value = true
    // This is done because the modal needs to be shown and the user needs to actually
    // consent to signing the transaction
    const signedTx = isSignableWallet(wallet.value)
      ? (
          await wallet.value?.SignTransaction?.(
            props.signedTx as HexPrefixedString,
          )
        )?.signed
      : (props.signedTx as HexPrefixedString)

    const txPromise =
      wallet.value?.getWalletType() === WalletType.WAGMI ||
      wallet.value?.getWalletType() === WalletType.INJECTED
        ? wallet.value?.SendTransaction?.(signedTx as HexPrefixedString)
        : wallet.value.broadcastTransaction(signedTx as HexPrefixedString)
    // TODO: handle hash for user

    await txPromise
      ?.then(hash => {
        // Build block explorer URLs
        const blockExplorerUrl = selectedChain.value?.blockExplorerTX
          ? selectedChain.value.blockExplorerTX.replace('[[txHash]]', hash)
          : ''

        const blockExplorerAddrUrl = selectedChain.value?.blockExplorerAddr
          ? selectedChain.value.blockExplorerAddr.replace(
              '[[address]]',
              props.toAddress,
            )
          : ''
        analytics.trackSendEventStatus(SendEventStatus.INITIATED, {
          token: props.toToken?.symbol,
          hash: hash,
        })

        // Add transaction notification
        tradeOrdersStore.addTransaction({
          type: 'transaction',
          hash,
          status: 'sent',
          fromAddress: props.fromAddress,
          toAddress: props.toAddress,
          amount: props.toAmount,
          symbol: props.toToken.symbol || '',
          tokenIcon: props.toToken.logo_url,
          usdValue: parseFloat(props.toAmountFiat).toFixed(6),
          networkFee: formatFee.value,
          networkFeeUSD: parseFloat(props.networkFeeUSD).toFixed(6),
          chainName: selectedChain.value?.nameLong || t('send.unknown_chain'),
          chainIcon: selectedChain.value?.icon,
          chainSymbol: selectedChain.value?.currencyName || '',
          blockExplorerUrl,
          blockExplorerAddrUrl,
          createdAt: Math.floor(Date.now() / 1000),
          seen: false,
          chainId: selectedChain.value?.chainID || '',
        })
        openModal.value = false
        model.value = false
        emit('tx-sent', hash)
      })
      .catch(e => {
        if (isUserRejectionError(e)) {
          toastStore.addToastMessage({
            type: ToastType.Info,
            text: t('common.error.user_canceled_request'),
          })
          return
        }

        const msg =
          e instanceof Error && e.message
            ? e.message.toLowerCase()
            : typeof e === 'object' && e !== null && 'message' in e
              ? String((e as Record<string, unknown>).message).toLowerCase()
              : typeof e === 'string'
                ? e.toLowerCase()
                : ''
        const errorMessage = msg ? sanitizeErrorMessage(msg) : undefined

        analytics.trackSendErrorEvent(SendEventError.SIGN_ERROR, {
          token: props.toToken?.symbol,
          errorMsg: errorMessage || msg,
        })

        toastStore.addToastMessage({
          type: ToastType.Error,
          text: t('send.toast.tx-send-failed'),
          textSecondary: getLocalizedWalletError(msg) ?? errorMessage,
        })

        captureException(e instanceof Error ? e : new Error(msg), {
          ...SENTRY_MODULE_TAGS.SEND,
          extra: {
            title: 'Error sending transaction: TX Promise',
            errorMessage: errorMessage,
          },
        })
      })
    signing.value = false
    showApproveMessage.value = false
  } catch (e) {
    signing.value = false
    showApproveMessage.value = false

    if (isUserRejectionError(e)) {
      toastStore.addToastMessage({
        type: ToastType.Info,
        text: t('common.error.user_canceled_request'),
      })
      return
    }

    const errorMessage =
      e instanceof Error && e.message
        ? sanitizeErrorMessage(e.message.toLowerCase())
        : typeof e === 'string'
          ? sanitizeErrorMessage(e)
          : typeof e === 'object' && e !== null && 'message' in e
            ? sanitizeErrorMessage(
                String((e as Record<string, unknown>).message).toLowerCase(),
              )
            : undefined

    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('send.toast.tx-send-failed'),
      textSecondary: getLocalizedWalletError(errorMessage) ?? errorMessage,
    })
    captureException(
      e instanceof Error ? e : new Error(errorMessage || 'Unknown error'),
      {
        ...SENTRY_MODULE_TAGS.SEND,
        extra: {
          title: 'Error sending transaction',
          errorMessage,
        },
      },
    )
  }
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
      return tx

      // on fail, assume legacy tx
    } catch {
      const common = commonGenerator(BigInt(chainId), Hardfork.Berlin)
      const tx = LegacyTransaction.fromSerializedTx(hexToBytes(serializedTx), {
        common,
      })
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
      data: bytesToHex(_details.data),
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
    data: bytesToHex(_details.data) || '0x',
    nonce: _details.nonce.toString(),
    gasLimit: formatIntegerToString(_details.gasLimit.toString()),
    gasPrice: formatFloatingPointValue(
      fromWei(_details.gasPrice.toString(), 'gwei'),
    ).value,
  }
})
</script>
