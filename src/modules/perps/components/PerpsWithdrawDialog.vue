<template>
  <app-dialog
    v-model:is-open="isOpen"
    title="Withdraw USDC"
    has-content-gutter
    @close-dialog="$emit('close')"
  >
    <template #content>
      <div class="pb-6" v-if="walletAddress">
        <!-- Withdraw to -->
        <div class="bg-surface rounded-12 p-4 mb-4">
          <p
            class="text-info text-s-11 uppercase tracking-wider font-medium mb-1"
          >
            Withdraw To
          </p>
          <p class="text-s-13 break-all font-mono">{{ walletAddress }}</p>
        </div>

        <!-- Available balance -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-info text-s-13">Available Balance</span>
          <span class="font-medium text-s-13">
            {{ formatUsd(withdrawableMargin) }} USDC
          </span>
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <perps-amount
            v-model:amount="amount"
            v-model:error="amountError"
            title="Amount"
            :validate-input="validateAmount"
          >
            <template #footer>
              <div class="flex justify-start mt-1">
                <button
                  class="px-3 sm:px-4 py-1 text-s-9 sm:text-s-11 leading-p-120 font-semibold bg-white hoverBGWhite rounded-full transition-all duration-150 shadow-button shadow-button-elevated"
                  @click="setMax"
                >
                  MAX
                </button>
              </div>
            </template>
          </perps-amount>
        </div>

        <!-- Error -->
        <p
          v-if="amountError || error"
          class="text-error text-s-12 mb-4"
        >
          {{ amountError || error }}
        </p>

        <!-- Success -->
        <div
          v-if="withdrawalSuccess"
          class="bg-light-green-1 rounded-12 p-4 mb-4"
        >
          <p class="text-success font-medium text-s-14">
            Withdrawal submitted!
          </p>
        </div>

        <button
          v-if="!withdrawalSuccess"
          :disabled="sending || !isValidAmount"
          class="w-full bg-black text-white rounded-full py-3 text-s-14 font-medium hoverOpacity disabled:opacity-50"
          @click="submitWithdraw"
        >
          {{ sending ? 'Processing...' : 'Withdraw' }}
        </button>
        <button
          v-else
          class="w-full bg-black text-white rounded-full py-3 text-s-14 font-medium hoverOpacity"
          @click="$emit('close')"
        >
          Done
        </button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import PerpsAmount from './PerpsAmount.vue'
import { perpsClient, USDC_DECIMALS } from '../configs'
import { mainnet } from 'viem/chains'
import { usePerpsAuth, usePerpsBalance } from '../composables/usePerpsAuth'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { hasInvalidPrecision } from '../utils/formatters'

const props = defineProps<{
  visible: boolean
}>()

defineEmits<{
  close: []
}>()

const isOpen = computed({
  get: () => props.visible,
  set: () => {},
})

const { accountId, triggerRefresh } = usePerpsAuth()
const { balance } = usePerpsBalance()
const store = useWalletStore()
const { wallet } = storeToRefs(store)
const perpsToasts = usePerpsToasts()

const amount = ref<number | null>(null)
const amountError = ref('')
const sending = ref(false)
const error = ref<string | null>(null)
const withdrawalSuccess = ref(false)
const walletAddress = ref<string | null>(null)

const withdrawableMargin = computed(
  () => balance.value?.withdrawableMargin ?? '0',
)

const isValidAmount = computed(() => {
  if (amount.value === null || amount.value <= 0) return false
  if (amountError.value) return false
  return amount.value <= parseFloat(withdrawableMargin.value)
})

const validateAmount = () => {
  if (amount.value === null) {
    amountError.value = ''
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

watch(
  () => props.visible,
  async visible => {
    if (!visible) return
    amount.value = null
    amountError.value = ''
    error.value = null
    withdrawalSuccess.value = false
    if (wallet.value) {
      walletAddress.value = await wallet.value.getAddress()
    }
  },
)

async function submitWithdraw() {
  if (!isValidAmount.value || !walletAddress.value || !accountId.value) return
  sending.value = true
  error.value = null
  try {
    // Check address book
    const bookRes = await perpsClient.getAddressBook()
    const found = bookRes.result.addressBook.some(
      entry =>
        entry.withdrawalAddress.toLowerCase() ===
        walletAddress.value!.toLowerCase(),
    )
    if (!found && wallet.value) {
      // Add to address book
      const challenge = await perpsClient.getAddressBookChallenge({
        walletAddress: walletAddress.value,
        chainId: '1',
        withdrawalAddress: walletAddress.value,
      })
      const signature = await wallet.value.SignMessage({
        message: challenge.result.message,
      })
      await perpsClient.completeAddressBookChallenge({
        id: challenge.result.id,
        signature,
        addressLabel: 'wallet',
      })
    }
    // Execute withdrawal
    await perpsClient.withdraw({
      customer_withdrawal_id: `withdraw-${Date.now()}`,
      symbol: 'USDC',
      network: 'ethereum',
      amount: String(amount.value),
      address: walletAddress.value,
      from: { id: accountId.value, wallet: 'margin' },
    })
    withdrawalSuccess.value = true
    triggerRefresh()
    perpsToasts.toastWithdrawalComplete()
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
