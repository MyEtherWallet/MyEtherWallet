<template>
  <app-dialog
    v-model:is-open="isOpen"
    title="Withdraw USDC"
    class="sm:max-w-[460px] sm:mx-auto"
    has-content-gutter
    @close-dialog="$emit('close')"
  >
    <template #content>
      <div v-if="walletAddress" class="mb-6">
        <div class="bg-mewBg rounded-20 p-4 bg-mewBg mb-4">
          <!-- Amount -->
          <div class="mb-4">
            <perps-amount
              v-model:amount="amount"
              v-model:error="amountError"
              title="Amount"
              :validate-input="validateAmount"
            >
              <template #footer>
                <div class="relative">
                  <!-- Error -->
                  <transition name="fade">
                    <p
                      v-if="amountError"
                      class="text-error text-s-12 absolute -top-2.5 left-0"
                    >
                      {{ amountError }}
                    </p>
                  </transition>

                  <div class="flex justify-start justify-between mt-3">
                    <button
                      v-if="!hasOpenPositions"
                      class="px-3 sm:px-4 py-1 text-s-9 sm:text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                      @click="setMax"
                    >
                      MAX
                    </button>
                    <!-- Available balance -->
                    <div class="ml-auto text-left">
                      <span class="text-info text-s-13">available:</span>
                      <span class="font-medium text-s-13 ml-1">
                        {{ formatUsd(withdrawableMargin) }} USDC
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </perps-amount>
          </div>
          <!-- Withdraw to -->
          <div class="mb-4">
            <p
              class="text-info text-s-11 uppercase tracking-sp-06 font-bold mb-2 pl-1"
            >
              Withdraw To
            </p>
            <div class="flex items-center mb-1">
              <app-blockie :address="walletAddress" class="mr-2" :size="6" />
              <p
                class="font-medium text-s-12 tracking-sp-06 text-wrap break-all"
              >
                {{ walletAddress }}
              </p>
            </div>
          </div>
          <!-- Withdrawal fee -->
          <div class="flex justify-between text-s-13">
            <span class="text-info">Withdrawal fee:</span>
            <span class="font-medium">${{ formatUsd(withdrawalFeeUSD) }}</span>
          </div>
        </div>

        <app-warning
          v-if="hasOpenPositions"
          title="Liquidation Risk"
          text="You have open positions. Withdrawing funds will reduce your account equity and increase your effective leverage, which may increase your liquidation risk."
          class="mb-4"
        />
        <transition name="fade">
          <div
            v-if="error"
            class="w-full p-4 bg-error-10 border border-error rounded-12 mb-2"
          >
            <p class="text-error text-s-14 text-center">
              {{ error }}
            </p>
          </div>
        </transition>
        <app-base-button
          v-if="addressBookLoading"
          disabled
          :is-loading="true"
          class="w-full"
          >Withdraw</app-base-button
        >
        <app-base-button
          v-else-if="isAddressAuthorized"
          :disabled="sending || !isValidAmount"
          :is-loading="sending"
          class="w-full"
          @click="submitWithdraw"
          >Withdraw</app-base-button
        >
        <app-base-button
          v-else
          :disabled="authorizing"
          :is-loading="authorizing"
          class="w-full"
          @click="submitAuthorize"
          >Authorize Withdrawals</app-base-button
        >
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import PerpsAmount from './PerpsAmount.vue'
import { perpsClient, USDC_DECIMALS, PERPS_CHAIN_ID } from '../configs'
import { mainnet } from 'viem/chains'
import AppWarning from '@/components/AppWarning.vue'
import { usePerpsAuth, usePerpsBalance } from '../composables/usePerpsAuth'
import { usePerpsPositions } from '../composables/usePerpsPositions'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { hasInvalidPrecision } from '../utils/formatters'
import AppBlockie from '@/components/AppBlockie.vue'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { toChecksumAddress } from '@/utils/addressUtils'
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = computed({
  get: () => props.visible,
  set: () => {},
})

const { accountId, triggerRefresh } = usePerpsAuth()
const { balance } = usePerpsBalance()
const { positions } = usePerpsPositions()
const store = useWalletStore()
const { wallet } = storeToRefs(store)
const perpsToasts = usePerpsToasts()

const amount = ref<number | null>(null)
const amountError = ref('')
const hasOpenPositions = computed(() => positions.value.length > 0)

const sending = ref(false)
const authorizing = ref(false)
const addressBookLoading = ref(false)
const isAddressAuthorized = ref(false)
const error = ref<string | null>(null)
const walletAddress = ref<string | null>(null)
const DEFAULT_WITHDRAWAL_FEE_USD = '1'
const withdrawalFeeUSD = ref(DEFAULT_WITHDRAWAL_FEE_USD)

const withdrawableMargin = computed(
  () => balance.value?.withdrawableMargin ?? '0',
)

const isValidAmount = computed(() => {
  if (amount.value === null || amount.value <= 0) return false
  // Don't trust amountError alone — its watcher is debounced 500ms, so a fast
  // submit could otherwise sneak past a stale-but-empty error string.
  if (!Number.isFinite(amount.value)) return false
  if (hasInvalidPrecision(amount.value, USDC_DECIMALS[mainnet.id])) return false
  if (amountError.value) return false
  return amount.value <= parseFloat(withdrawableMargin.value)
})

const validateAmount = () => {
  if (amount.value === null) {
    amountError.value = ''
    return
  }
  if (!Number.isFinite(amount.value)) {
    amountError.value = 'Amount is too large'
    return
  }
  if (hasInvalidPrecision(amount.value, USDC_DECIMALS[mainnet.id])) {
    amountError.value = `Amount supports up to ${USDC_DECIMALS[mainnet.id]} decimal places`
    return
  }
  if (amount.value > parseFloat(withdrawableMargin.value)) {
    amountError.value = 'Amount exceeds available balance'
    return
  }
  amountError.value = ''
}

const setMax = () => {
  const max = parseFloat(withdrawableMargin.value)
  amount.value = isNaN(max) ? null : max
  validateAmount()
}

async function refreshAddressBookStatus() {
  if (!walletAddress.value) {
    isAddressAuthorized.value = false
    return
  }
  addressBookLoading.value = true
  try {
    const bookRes = await perpsClient.getAddressBook()
    isAddressAuthorized.value = bookRes.result.addressBook.some(
      entry =>
        entry.withdrawalAddress.toLowerCase() ===
        walletAddress.value!.toLowerCase(),
    )
  } catch (e) {
    isAddressAuthorized.value = false
    captureException(e, {
      ...SENTRY_MODULE_TAGS.PERPS,
      extra: {
        title: 'PERPS: Error fetching address book',
      },
    })
  } finally {
    addressBookLoading.value = false
  }
}

watch(
  () => props.visible,
  async visible => {
    if (!visible) return
    amount.value = null
    amountError.value = ''
    error.value = null
    isAddressAuthorized.value = false
    // Show the action button in a loading state from the moment the dialog
    // opens until the address-book check resolves, so it doesn't flash
    // "Authorize Withdrawals" and then swap to "Withdraw".
    addressBookLoading.value = true
    if (wallet.value) {
      walletAddress.value = await wallet.value.getAddress()
    }
    await refreshAddressBookStatus()
    try {
      const accountRes = await perpsClient.getAccount()
      withdrawalFeeUSD.value =
        accountRes?.result?.withdrawalFeeUSD ?? DEFAULT_WITHDRAWAL_FEE_USD
    } catch (e) {
      // Keep the default fee shown if the lookup fails.
      captureException(e, {
        ...SENTRY_MODULE_TAGS.PERPS,
        extra: {
          title: 'PERPS: Error fetching withdrawal fee',
        },
      })
    }
  },
)

async function submitAuthorize() {
  if (!walletAddress.value || !wallet.value) return
  authorizing.value = true
  error.value = null
  try {
    const checksumAddress = toChecksumAddress(walletAddress.value)
    const challenge = await perpsClient.getAddressBookChallenge({
      walletAddress: checksumAddress,
      chainId: PERPS_CHAIN_ID,
      withdrawalAddress: checksumAddress,
    })
    const signature = await wallet.value.SignMessage({
      message: challenge.result.message,
    })
    await perpsClient.completeAddressBookChallenge({
      id: challenge.result.id,
      signature,
      addressLabel: 'wallet',
    })
    perpsToasts.toastWithdrawalAddressAdded(walletAddress.value)
    // Keep the withdraw dialog open and switch to the withdraw view now that
    // the address is authorized (the toast already surfaces the 24h cooldown).
    isAddressAuthorized.value = true
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Failed to authorize withdrawal address'
  } finally {
    authorizing.value = false
  }
}

async function submitWithdraw() {
  if (!isValidAmount.value || !walletAddress.value || !accountId.value) return
  sending.value = true
  error.value = null
  try {
    await perpsClient.withdraw({
      customer_withdrawal_id: `withdraw-${Date.now()}`,
      symbol: 'USDC',
      network: 'ethereum',
      amount: String(amount.value),
      address: toChecksumAddress(walletAddress.value),
      from: { id: accountId.value, wallet: 'margin' },
    })
    triggerRefresh()
    perpsToasts.toastWithdrawalComplete()
    emit('close')
  } catch (e) {
    // TODO(perps-toasts): spec has no withdrawal-failure toast; revisit with design if needed
    error.value = e instanceof Error ? e.message : 'Withdrawal failed'
  } finally {
    sending.value = false
  }
}

function formatUsd(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '0.00'
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>
