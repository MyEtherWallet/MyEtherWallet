<template>
  <app-dialog v-model:is-open="isOpen" @close-dialog="$emit('close')">
    <div class="p-6">
      <p class="font-bold text-s-20 mb-4">Withdraw USDC</p>

      <div v-if="walletAddress">
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
          <label
            class="text-info text-s-11 uppercase tracking-wider font-medium mb-1.5 block"
          >
            Amount
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="amount"
              type="text"
              placeholder="0.00"
              class="flex-1 bg-surface rounded-12 px-4 py-3 text-s-14 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              class="text-primary text-s-13 font-medium"
              @click="amount = withdrawableMargin"
            >
              MAX
            </button>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-error text-s-12 mb-4">{{ error }}</p>

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
    </div>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { perpsClient } from '../configs'
import { usePerpsAuth, usePerpsBalance } from '../composables/usePerpsAuth'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'

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

const amount = ref('')
const sending = ref(false)
const error = ref<string | null>(null)
const withdrawalSuccess = ref(false)
const walletAddress = ref<string | null>(null)

const withdrawableMargin = computed(
  () => balance.value?.withdrawableMargin ?? '0',
)

const isValidAmount = computed(() => {
  if (!amount.value) return false
  const n = parseFloat(amount.value)
  return !isNaN(n) && n > 0 && n <= parseFloat(withdrawableMargin.value)
})

watch(
  () => props.visible,
  async visible => {
    if (!visible) return
    amount.value = ''
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
      amount: amount.value,
      address: walletAddress.value,
      from: { id: accountId.value, wallet: 'margin' },
    })
    withdrawalSuccess.value = true
    triggerRefresh()
  } catch (e) {
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
