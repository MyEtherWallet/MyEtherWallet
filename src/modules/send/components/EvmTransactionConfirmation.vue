<template>
  <app-dialog
    v-model:is-open="openModal"
    hide-close
    class="w-full sm:w-[480px] sm:mx-auto !rounded-20"
  >
    <template #title>
      <h1
        id="dialogTitle"
        class="w-full text-center text-heading-base text-text-default px-12 pt-[29px] pb-[21px]"
      >
        {{ $t('send.review-send') }}
      </h1>
      <app-btn-icon-close
        variant="filled"
        class="absolute top-6 right-6"
        @close="openModal = false"
      />
    </template>
    <template #content>
      <div class="flex flex-col gap-6 p-6">
        <div class="flex flex-col gap-8 pb-6">
          <div class="flex flex-col gap-3">
            <p class="text-label-base text-text-default">
              {{ $t('common.summary') }}
            </p>
            <div
              class="flex flex-col gap-4 p-4 rounded-16 bg-background-default"
            >
              <div class="flex items-center gap-3">
                <app-content-group :title="$t('common.amount')" class="flex-1" />
                <app-content-group
                  :title="`${toAmount} ${toToken.symbol}`"
                  :description="`≈ ${formatFiat(toAmountFiat).display}`"
                  align="right"
                  class="flex-1"
                />
                <!-- The network row is gone from the design; its logo rides on the token as a badge -->
                <app-avatar
                  type="cryptoAsset"
                  size="l"
                  :url="toToken.logo_url || network?.icon"
                  :symbol="toToken.symbol"
                  :badge-bottom="!!network?.icon"
                >
                  <template #badge>
                    <app-avatar-badge type="network">
                      <img
                        :src="network?.icon"
                        :alt="network?.nameLong"
                        class="w-full h-full object-cover"
                      />
                    </app-avatar-badge>
                  </template>
                </app-avatar>
              </div>
              <app-divider class="-my-1" />
              <div class="flex items-center gap-3">
                <app-content-group :title="$t('common.from')" class="flex-1" />
                <app-content-group
                  :title="truncateAddress(fromAddress)"
                  :description="fromAccountName"
                  align="right"
                  class="flex-1"
                />
                <app-avatar type="account" size="l" :address="fromAddress" />
              </div>
              <app-divider class="-my-1" />
              <div class="flex items-center gap-3">
                <app-content-group
                  :title="$t('common.recipient')"
                  class="flex-1"
                />
                <app-content-group
                  :title="truncateAddress(toAddress)"
                  align="right"
                  class="flex-1"
                />
                <app-avatar type="account" size="l" :address="toAddress" />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <p class="text-label-base text-text-default">
              {{ $t('common.network_fee') }}:
            </p>
            <!-- Picks the fee tier; ModuleSend rebuilds the tx at that priority -->
            <button
              type="button"
              class="flex items-center gap-2 h-[52px] px-4 rounded-16 bg-background-default hover:bg-background-default-hover transition-colors disabled:cursor-default"
              :disabled="feeLoading"
              @click="emit('edit-fee')"
            >
              <span class="text-label-sm text-text-default whitespace-nowrap">
                ≈ {{ formatFiat(networkFeeUSD).display }}
                <span class="text-text-sm text-text-subtle">
                  ({{ formatFee }} {{ network?.currencyName }})
                </span>
              </span>
              <span class="flex flex-1 justify-end min-w-0">
                <app-tag
                  :type="isRecommendedFee ? 'success' : 'neutral'"
                  variant="contrast"
                  :leading-icon="isRecommendedFee ? 'check-badge' : undefined"
                  :label="feeTierLabel"
                />
              </span>
              <AppIcon name="chevron-down" size="s" class="text-text-default" />
            </button>
            <app-input-feedback
              v-if="feeErrorMessage"
              type="error"
              :message="feeErrorMessage"
            />
          </div>

          <div v-if="txDataFormatted" class="flex flex-col gap-3">
            <app-base-button
              type="tertiary"
              surface="alternative"
              size="small"
              class="self-start"
              @click="showMoreDetails = !showMoreDetails"
            >
              {{ $t('common.more_details') }}
              <template #trailing>
                <AppIcon
                  name="chevron-down"
                  size="xxs"
                  class="transition-transform"
                  :class="{ 'rotate-180': showMoreDetails }"
                />
              </template>
            </app-base-button>
            <expand-transition>
              <div
                v-if="showMoreDetails"
                class="flex flex-col gap-4 p-4 rounded-16 bg-background-default"
              >
                <div
                  v-for="row in detailRows"
                  :key="row.label"
                  class="flex items-start justify-between gap-3"
                >
                  <p class="text-text-sm text-text-subtle whitespace-nowrap">
                    {{ row.label }}
                  </p>
                  <p class="text-label-sm text-text-default text-right">
                    {{ row.value }}
                  </p>
                </div>
                <div class="flex items-start justify-between gap-3">
                  <p class="text-text-sm text-text-subtle">
                    {{ $t('common.data') }}
                  </p>
                  <p
                    class="max-w-[70%] text-right text-s-12 break-all font-mono bg-white px-3 py-2 rounded-8 text-text-default"
                  >
                    {{ txDataFormatted.data }}
                  </p>
                </div>
              </div>
            </expand-transition>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <expand-transition>
            <p
              v-if="showApproveMessage"
              class="text-label-base text-text-brand text-center animate-pulse"
            >
              {{ $t('send.approve-tx-on-device') }}
            </p>
          </expand-transition>
          <app-base-button
            class="w-full"
            :is-loading="signing || feeLoading"
            :disabled="!signedTx || !!feeError"
            @click="confirmTransaction"
          >
            {{ $t('verify-tx.confirm') }}
          </app-base-button>
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
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import AppTag from '@/components/tag/AppTag.vue'
import { truncateAddress } from '@/utils/filters'
import { useGlobalStore } from '@/stores/globalStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useWalletStore } from '@/stores/walletStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification/index'
import { useChainsStore } from '@/stores/chainsStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import {
  formatFloatingPointValue,
  formatIntegerToString,
} from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type HexPrefixedString } from '@/providers/types'
import { WalletType, GasPriceType } from '@/providers/types'
import AppIcon from '@/components/icon/AppIcon.vue'
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
  isTransientTrezorError,
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
  /** The parent is rebuilding the tx after a fee tier change. */
  feeLoading?: boolean
  feeError?: string
}

const props = defineProps<EvmTxType>()
const model = defineModel()
const emit = defineEmits<{
  'tx-sent': [txHash: string]
  'edit-fee': []
}>()
const { formatFiat } = useCurrency()
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

        // Close the verify dialog on failure so stale tx details (from
        // address, amounts) don't linger behind the error toast.
        openModal.value = false
        model.value = false

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
    openModal.value = false
    model.value = false
    // A transient Trezor empty-payload signing failure (APP-MEW-WEB-56) is
    // surfaced to the user as a friendly "reconnect" toast above and is safe to
    // retry, so don't report it to Sentry as a crash.
    if (!isTransientTrezorError(e)) {
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
}

const formatFee = computed(() => {
  return formatFloatingPointValue(props.networkFeeCrypto).value
})

const { gasPriceType } = storeToRefs(useGlobalStore())
const isRecommendedFee = computed(
  () => gasPriceType.value === GasPriceType.REGULAR,
)
const feeTierLabel = computed(() =>
  t(`select_fee.${gasPriceType.value.toLowerCase()}.title`),
)
const feeErrorMessage = computed(() =>
  props.feeError === 'NOT_ENOUGH_BALANCE'
    ? t('common.not_enough_balance_to_cover_fee', {
        symbol: props.network?.currencyName,
      })
    : props.feeError,
)

const watchOnlyStore = useWatchOnlyStore()
const fromAccountName = computed(
  () => watchOnlyStore.activeAccount?.addressName,
)

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
  // signedTx is cleared while the parent rebuilds it for a new fee tier
  if (props.signedTx && selectedChain.value && selectedChain.value.chainID) {
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

const detailRows = computed(() => {
  const tx = txDataFormatted.value
  if (!tx) return []
  const gwei = (value?: string) => value && `${value} Gwei`
  return [
    { label: t('common.nonce'), value: tx.nonce },
    { label: t('gas.limit'), value: tx.gasLimit },
    { label: t('gas.max_fee'), value: gwei(tx.maxFeePerGas) },
    { label: t('gas.max_priority'), value: gwei(tx.maxPriorityFeePerGas) },
    { label: t('gas.price'), value: gwei(tx.gasPrice) },
  ].filter(row => row.value)
})
</script>
