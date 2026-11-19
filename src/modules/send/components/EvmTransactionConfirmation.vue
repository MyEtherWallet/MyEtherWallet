<template>
  <app-modal :title="$t('verify-tx.title')" v-model="openModal">
    <div class="flex flex-col gap-6 p-6">
      <expand-transition>
        <div v-if="showApproveMessage">
          <p
            key="confirmation-approve-message"
            class="text-center text-label-base text-text-brand animate-pulse"
          >
            {{ $t('send.approve-tx-on-device') }}
          </p>
        </div>
      </expand-transition>

      <div class="flex flex-col gap-8 pb-6">
        <div class="flex flex-col gap-3">
          <p class="text-label-base text-text-default">
            {{ $t('verify-tx.summary') }}
          </p>
          <div
            class="flex w-full flex-col gap-4 overflow-hidden rounded-16 bg-background-default p-4"
          >
            <div class="flex items-center gap-3">
              <app-content-group
                :title="$t('verify-tx.youre-sending')"
                class="flex-1"
              />
              <app-content-group
                :title="`${toAmount} ${toToken.symbol ?? ''}`"
                :description="`≈ ${formatFiat(toAmountFiat).display}`"
                align="right"
                class="flex-1"
              />
              <app-token-logo
                :url="toToken.logo_url || selectedChain?.icon"
                :symbol="toToken.symbol"
                width="w-10"
                height="h-10"
                no-shadow
              />
            </div>

            <app-divider variant="alternative" class="-my-1" />

            <div class="flex items-center gap-3">
              <app-content-group :title="$t('common.from')" class="flex-1" />
              <app-content-group
                :title="truncateAddress(fromAddress, 6, 4)"
                :description="fromAccountName"
                align="right"
                class="flex-1"
              />
              <app-avatar type="account" size="l" :address="fromAddress" />
            </div>

            <app-divider variant="alternative" class="-my-1" />

            <div class="flex items-center gap-3">
              <app-content-group :title="$t('common.to')" class="flex-1" />
              <app-content-group
                :title="truncateAddress(toAddress, 6, 4)"
                align="right"
                class="flex-1"
              />
              <app-avatar type="account" size="l" :address="toAddress" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <p class="text-label-base text-text-default">
            {{ $t('common.network_fee') }}
          </p>
          <app-select-tx-fee
            :fees="gasFees"
            :tx-request-body="txRequestBody"
            v-model:gas-fee-error="gasFeeError"
            :reset-to-default="false"
            :disabled="signing"
            dropdown
          />
        </div>
      </div>

      <app-base-button
        class="w-full"
        :disabled="isPreparing || !!gasFeeError"
        :is-loading="signing"
        @click="confirmTransaction"
      >
        {{ $t('verify-tx.confirm') }}
      </app-base-button>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { type Chain } from '@/mew_api/types'
import type {
  TokenBalanceRaw,
  QuotesResponse,
  EstimatesRequestBody,
  BitcoinQuotesRequestBody,
} from '@/mew_api/types'
import AppModal from '@/components/modal/AppModal.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { truncateAddress } from '@/utils/filters'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification/index'
import { useChainsStore } from '@/stores/chainsStore'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { type HexPrefixedString } from '@/providers/types'
import { WalletType } from '@/providers/types'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import { useI18n } from 'vue-i18n'
import {
  isSignableWallet,
  isUserRejectionError,
  getLocalizedWalletError,
  isTransientTrezorError,
  isBlindSigningDisabledError,
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
  gasFees?: QuotesResponse
  txRequestBody?: EstimatesRequestBody | BitcoinQuotesRequestBody
  /** The parent is rebuilding the tx for a newly picked fee. */
  isPreparing?: boolean
}

const props = defineProps<EvmTxType>()
const model = defineModel()
const gasFeeError = defineModel<string>('gasFeeError', { default: '' })
const emit = defineEmits<{
  'tx-sent': [txHash: string]
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

// The account's saved name; skipped while it is just the shortened address.
const watchOnlyStore = useWatchOnlyStore()
const fromAccountName = computed(() => {
  const name = watchOnlyStore.activeAccount?.addressName
  return name && name !== truncateAddress(props.fromAddress, 6, 4) ? name : ''
})
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
    if (!isTransientTrezorError(e) && !isBlindSigningDisabledError(e)) {
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
</script>
