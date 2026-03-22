<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-3',
      ]"
    >
      <div class="w-full max-w-[500px] relative">
        <div class="flex items-end justify-between mb-2 px-4">
          <div>
            <p class="font-bold text-s-28">Perps</p>
            <p class="text-info text-s-12 ml-1">Perpetual futures trading</p>
          </div>
        </div>
        <div class="relative transition-all duration-300">
          <!-- Not authenticated -->
          <div
            v-if="!token"
            class="bg-mewBg rounded-20 px-4 pb-6 pt-6 mx-auto text-center"
          >
            <p v-if="!isWalletConnected" class="text-info text-s-14">
              Connect wallet to trade perps
            </p>
            <template v-else>
              <p class="text-info text-s-14 mb-4">Sign in to start trading</p>
              <button
                :disabled="isAuthenticating"
                class="bg-primary text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity w-full"
                @click="login"
              >
                {{ isAuthenticating ? 'Signing in...' : 'Sign in to Perps' }}
              </button>
              <p v-if="authError" class="text-error text-s-12 mt-2">
                {{ authError }}
              </p>
            </template>
          </div>

          <!-- Authenticated -->
          <div v-else class="bg-mewBg rounded-20 px-4 pb-4 pt-4 mx-auto">
            <div class="mb-4">
              <p class="text-info text-s-12">Account Value</p>
              <p class="font-bold text-s-20">{{ formatUsd(marginBalance) }}</p>
              <p :class="pnlColorClass" class="text-s-12 font-medium">
                PnL: {{ formatPnl(unrealizedPnl) }}
              </p>
            </div>
            <div class="flex gap-2 mb-4">
              <router-link
                :to="{ name: 'Perps' }"
                class="flex-1 bg-primary text-white rounded-full py-2.5 text-s-14 font-medium text-center hoverOpacity"
              >
                Open Perps
              </router-link>
            </div>
            <!-- Positions summary -->
            <div v-if="positions.length > 0">
              <p
                class="text-info text-s-11 uppercase tracking-wider font-medium mb-2"
              >
                Open Positions ({{ positions.length }})
              </p>
              <div
                v-for="pos in positions.slice(0, 3)"
                :key="pos.market"
                class="flex items-center justify-between py-2 border-b border-grey-10 last:border-0"
              >
                <div>
                  <span class="font-medium text-s-13">{{
                    getBase(pos.market)
                  }}</span>
                  <span
                    :class="[
                      pos.direction === 'long' ? 'text-success' : 'text-error',
                      'text-s-11 ml-1 capitalize',
                    ]"
                  >
                    {{ pos.direction }} {{ pos.leverage }}x
                  </span>
                </div>
                <span
                  :class="pnlColor(pos.unrealizedPnl)"
                  class="text-s-13 font-medium"
                >
                  {{ formatPnl(pos.unrealizedPnl) }}
                </span>
              </div>
            </div>
            <div v-else class="text-center text-info text-s-13 py-2">
              No open positions
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePerpsAuth, usePerpsBalance } from './composables/usePerpsAuth'
import { usePerpsPositions } from './composables/usePerpsPositions'

const { token, isWalletConnected, isAuthenticating, authError, login } =
  usePerpsAuth()
const { balance } = usePerpsBalance()
const { positions } = usePerpsPositions()

const marginBalance = computed(() => balance.value?.marginBalance ?? '0')
const unrealizedPnl = computed(() => balance.value?.unrealizedPnl ?? '0')

const pnlColorClass = computed(() => {
  const n = parseFloat(unrealizedPnl.value)
  if (n > 0) return 'text-success'
  if (n < 0) return 'text-error'
  return 'text-info'
})

function getBase(market: string): string {
  return market.split('-')[0] ?? market
}

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

function pnlColor(val: string): string {
  const n = parseFloat(val)
  if (n > 0) return 'text-success'
  if (n < 0) return 'text-error'
  return 'text-info'
}
</script>
