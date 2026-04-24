<template>
  <app-dialog v-model:is-open="isOpen" class="w-full max-w-[440px]">
    <template #title>
      <div class="mr-8 pt-5 pl-6">
        <span class="font-bold text-s-20">Auto close</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-4">
        <!-- Asset & Price -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <app-token-logo
              :url="getLogoUrl(displaySymbol)"
              :symbol="displaySymbol"
              width="w-7"
              height="h-7"
            />
            <span class="font-bold text-s-16">{{ displaySymbol }}</span>
          </div>
          <div class="text-right">
            <span class="text-info text-s-14 mr-2">Current price</span>
            <span class="font-bold text-s-16">{{
              formatUsd(currentPrice)
            }}</span>
          </div>
        </div>

        <!-- Take Profit -->
        <div class="bg-mewBg rounded-[20px] p-5">
          <div class="flex justify-between items-center mb-3 px-1">
            <p class="text-s-14 font-bold">
              Take profit if {{ displaySymbol }} reaches
            </p>
            <button
              class="text-[#0052ff] text-s-14 font-bold hover:opacity-70"
              @click="$emit('clearTakeProfit')"
            >
              Clear
            </button>
          </div>
          <div
            class="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e7eb]"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="flex items-center gap-1 text-s-14 font-medium text-info"
              >
                Price
              </div>
              <p class="font-bold text-[28px] tracking-tight">
                {{
                  tempTakeProfitPrice !== null
                    ? formatUsd(tempTakeProfitPrice)
                    : '—'
                }}
              </p>
            </div>
            <div class="flex justify-between gap-2 mb-3">
              <button
                v-for="pct in [10, 20, 30, 50, 100]"
                :key="pct"
                class="h-[34px] flex-1 border rounded-full text-[13px] font-bold transition-all flex items-center justify-center bg-white"
                :class="
                  activeTpPill === pct
                    ? 'border-[#0052ff] text-[#0052ff]'
                    : 'border-[#e5e7eb] hover:border-grey-300'
                "
                @click="$emit('setTakeProfitPct', pct)"
              >
                +{{ pct }}%
              </button>
            </div>
            <div
              v-if="
                tempProjectedProfit !== null && tempTakeProfitPrice !== null
              "
              class="text-right text-s-13 mt-2"
            >
              <span class="text-info">Projected profit</span>
              <span class="text-success font-bold ml-2"
                >+{{ formatUsd(Math.abs(tempProjectedProfit)) }}</span
              >
            </div>
          </div>
        </div>

        <!-- Stop Loss -->
        <div class="bg-mewBg rounded-[20px] p-5">
          <div class="flex justify-between items-center mb-3 px-1">
            <p class="text-s-14 font-bold">
              Stop loss if {{ displaySymbol }} reaches
            </p>
            <button
              class="text-[#0052ff] text-s-14 font-bold hover:opacity-70"
              @click="$emit('clearStopLoss')"
            >
              Clear
            </button>
          </div>
          <div
            class="bg-white rounded-[16px] p-5 shadow-sm border border-[#e5e7eb]"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="flex items-center gap-1 text-s-14 font-medium text-info"
              >
                Price
              </div>
              <p class="font-bold text-[28px] tracking-tight">
                {{
                  tempStopLossPrice !== null
                    ? formatUsd(tempStopLossPrice)
                    : '—'
                }}
              </p>
            </div>
            <div class="flex justify-between gap-2 mb-3">
              <button
                v-for="pct in [1, 2, 3, 4, 5]"
                :key="pct"
                class="h-[34px] flex-1 border rounded-full text-[13px] font-bold transition-all flex items-center justify-center bg-white"
                :class="
                  activeSlPill === pct
                    ? 'border-[#c9379d] text-[#c9379d]'
                    : 'border-[#e5e7eb] hover:border-grey-300'
                "
                @click="$emit('setStopLossPct', pct)"
              >
                -{{ pct }}%
              </button>
            </div>
            <div
              v-if="tempProjectedLoss !== null && tempStopLossPrice !== null"
              class="text-right text-s-13 mt-2"
            >
              <span class="text-info">Projected loss</span>
              <span class="text-error font-bold ml-2"
                >-{{ formatUsd(Math.abs(tempProjectedLoss)) }}</span
              >
            </div>
          </div>
        </div>

        <!-- Add Button -->
        <app-base-button class="w-full" @click="$emit('confirm')">
          Add
        </app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { formatUsd } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'

const isOpen = defineModel<boolean>('isOpen', { default: false })

defineProps<{
  displaySymbol: string
  currentPrice: number
  tempTakeProfitPrice: number | null
  tempStopLossPrice: number | null
  tempProjectedProfit: number | null
  tempProjectedLoss: number | null
  activeTpPill: number | null
  activeSlPill: number | null
}>()

defineEmits<{
  clearTakeProfit: []
  clearStopLoss: []
  setTakeProfitPct: [pct: number]
  setStopLossPct: [pct: number]
  confirm: []
}>()
</script>
