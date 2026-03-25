<template>
  <div class="bg-white rounded-20 p-6 sm:p-8">
    <!-- Not authenticated -->
    <div v-if="!isWalletConnected || isWatchOnly" class="text-center py-8">
      <p class="text-info text-s-14 mb-4">
        Connect your wallet to view your perps portfolio
      </p>
      <button
        class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
        @click="connectWallet"
      >
        Connect Wallet
      </button>
    </div>
    <div v-else-if="!token" class="text-center py-8">
      <p class="text-info text-s-14 mb-4">
        Sign in to view your perps portfolio
      </p>
      <button
        :disabled="isAuthenticating"
        class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
        @click="login"
      >
        {{ isAuthenticating ? 'Signing in...' : 'Sign in to Perps' }}
      </button>
      <p v-if="authError" class="text-error text-s-12 mt-2">{{ authError }}</p>
    </div>

    <!-- Authenticated -->
    <div v-else class="flex items-end justify-between">
      <div>
        <p class="text-info text-s-14">Total account value</p>
        <p class="font-bold text-s-40 mt-1">{{ formatUsd(marginBalance) }}</p>
        <div class="flex items-center gap-4 mt-1">
          <p class="text-s-14">
            <span class="text-info">Unrealized PnL</span>
            <span :class="pnlColorClass" class="ml-2 font-bold">
              {{ formatPnl(unrealizedPnl) }}
              ({{ pnlPercent }})
            </span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="bg-primary text-white rounded-full px-8 py-3 text-s-16 font-bold hoverOpacity"
          @click="$emit('deposit')"
        >
          Deposit
        </button>
        <button
          class="border-1 border-primary text-primary rounded-full px-8 py-3 text-s-16 font-bold hoverOpacity"
          @click="$emit('withdraw')"
        >
          Withdraw
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePerpsAuth, usePerpsBalance } from '../composables/usePerpsAuth'
import { formatUsd, formatPnl, pnlColor } from '../utils/formatters'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'

defineEmits<{
  deposit: []
  withdraw: []
}>()

const walletStore = useWalletStore()
const { isWatchOnly } = storeToRefs(walletStore)
const accessStore = useAccessStore()

const connectWallet = () => {
  accessStore.openAccessDialog()
}

const { token, isWalletConnected, isAuthenticating, authError, login } =
  usePerpsAuth()
const { balance } = usePerpsBalance()

const marginBalance = computed(() => balance.value?.marginBalance ?? '0')
const unrealizedPnl = computed(() => balance.value?.unrealizedPnl ?? '0')

const pnlPercent = computed(() => {
  const margin = parseFloat(marginBalance.value)
  const pnl = parseFloat(unrealizedPnl.value)
  if (!margin || isNaN(pnl)) return '0.00%'
  const pct = (pnl / margin) * 100
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
})

const pnlColorClass = computed(() => pnlColor(unrealizedPnl.value))
</script>
