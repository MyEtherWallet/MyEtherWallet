<template>
  <div class="bg-white rounded-20 p-6 sm:p-8">
    <!-- Not authenticated -->
    <div v-if="!token" class="text-center py-8">
      <p class="text-info text-s-14 mb-4">
        Connect and sign in to view your perps portfolio
      </p>
      <button
        v-if="isWalletConnected"
        :disabled="isAuthenticating"
        class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
        @click="login"
      >
        {{ isAuthenticating ? 'Signing in...' : 'Sign in to Perps' }}
      </button>
      <p v-if="authError" class="text-error text-s-12 mt-2">{{ authError }}</p>
    </div>

    <!-- Authenticated -->
    <div v-else>
      <p class="text-info text-s-14">Total account value</p>
      <p class="font-bold text-s-36 mt-1">{{ formatUsd(marginBalance) }}</p>
      <div class="flex items-center gap-4 mt-1">
        <p class="text-s-14">
          <span class="text-info">Unrealized PnL</span>
          <span :class="pnlColorClass" class="ml-2 font-medium">
            {{ formatPnl(unrealizedPnl) }}
            ({{ pnlPercent }})
          </span>
        </p>
      </div>
      <div class="flex items-center gap-3 mt-6">
        <button
          class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
          @click="$emit('deposit')"
        >
          Deposit
        </button>
        <button
          class="border-1 border-black rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
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

defineEmits<{
  deposit: []
  withdraw: []
}>()

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

const pnlColorClass = computed(() => {
  const n = parseFloat(unrealizedPnl.value)
  if (n > 0) return 'text-success'
  if (n < 0) return 'text-error'
  return 'text-info'
})

function formatUsd(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '$0.00'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

function formatPnl(val: string): string {
  const n = parseFloat(val)
  if (isNaN(n)) return '$0.00'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${formatUsd(val)}`
}
</script>
