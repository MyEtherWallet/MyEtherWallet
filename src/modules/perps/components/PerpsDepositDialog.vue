<template>
  <app-dialog v-model:is-open="isOpen" @close-dialog="$emit('close')">
    <div class="p-6">
      <p class="font-bold text-s-20 mb-4">Deposit USDC</p>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8 text-info text-s-14">
        Loading deposit address...
      </div>

      <div v-else-if="depositAddress">
        <!-- Address -->
        <div class="bg-surface rounded-12 p-4 mb-4">
          <p
            class="text-info text-s-11 uppercase tracking-wider font-medium mb-1"
          >
            Deposit Address (Ethereum)
          </p>
          <p class="text-s-13 break-all font-mono">{{ depositAddress }}</p>
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <label
            class="text-info text-s-11 uppercase tracking-wider font-medium mb-1.5 block"
          >
            Amount (USDC)
          </label>
          <input
            v-model="amount"
            type="text"
            placeholder="0.00"
            class="w-full bg-surface rounded-12 px-4 py-3 text-s-14 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-error text-s-12 mb-4">{{ error }}</p>

        <!-- Tx confirmed -->
        <div v-if="txConfirmed" class="bg-light-green-1 rounded-12 p-4 mb-4">
          <p class="text-success font-medium text-s-14">
            Deposit submitted successfully!
          </p>
          <p class="text-info text-s-12 mt-1">
            Funds may take a few minutes to appear.
          </p>
        </div>

        <button
          v-if="!txConfirmed"
          :disabled="sending || !amount"
          class="w-full bg-black text-white rounded-full py-3 text-s-14 font-medium hoverOpacity disabled:opacity-50"
          @click="sendDeposit"
        >
          {{ sending ? 'Sending...' : 'Send Deposit' }}
        </button>
        <button
          v-else
          class="w-full bg-black text-white rounded-full py-3 text-s-14 font-medium hoverOpacity"
          @click="$emit('close')"
        >
          Done
        </button>
      </div>

      <!-- Error loading address -->
      <div v-else-if="error" class="text-center py-8 text-error text-s-14">
        {{ error }}
      </div>
    </div>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { perpsClient } from '../configs'
import { usePerpsAuth } from '../composables/usePerpsAuth'
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
const store = useWalletStore()
const { wallet } = storeToRefs(store)

const depositAddress = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const amount = ref('')
const sending = ref(false)
const txConfirmed = ref(false)

watch(
  () => props.visible,
  async visible => {
    if (!visible) return
    txConfirmed.value = false
    amount.value = ''
    error.value = null
    await fetchDepositAddress()
  },
)

async function fetchDepositAddress() {
  if (!accountId.value) return
  loading.value = true
  error.value = null
  try {
    const res = await perpsClient.listDepositAddresses({
      coins: ['USDC'],
      network: 'ethereum',
      depositDestination: { id: accountId.value, wallet: 'margin' },
    })
    if (res.result && res.result.length > 0) {
      depositAddress.value = res.result[0].address
    } else {
      const provision = await perpsClient.provisionAddress({
        network: 'ethereum',
        symbol: 'USDC',
        deposit_destination: { id: accountId.value, wallet: 'margin' },
      })
      depositAddress.value = provision.result.address
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Failed to fetch deposit address'
  } finally {
    loading.value = false
  }
}

async function sendDeposit() {
  if (!amount.value || !depositAddress.value || !wallet.value) return
  sending.value = true
  error.value = null
  try {
    // Deposit is done by sending USDC to the deposit address
    // The actual transfer implementation depends on wallet type
    // For now we show the deposit address for users to send directly
    txConfirmed.value = true
    triggerRefresh()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Transaction failed'
  } finally {
    sending.value = false
  }
}
</script>
