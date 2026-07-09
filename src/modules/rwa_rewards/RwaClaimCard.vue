<template>
  <div
    class="flex flex-col w-full gap-4 p-4 rounded-16 border border-black/15 bg-white"
  >
    <div class="flex items-center gap-3 w-full">
      <img :src="usdcIcon" alt="" class="w-8 h-8 shrink-0" />
      <div class="flex flex-col flex-1 min-w-0">
        <p
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
        >
          {{ amountLabel }}
        </p>
        <p class="text-s-12 leading-[18px] text-[#575757]">
          {{ subtitle }}
        </p>
      </div>
      <div
        v-if="variant === 'sent' || variant === 'closed'"
        class="flex items-center justify-center shrink-0 w-6 h-6 rounded-full"
        :class="variant === 'sent' ? 'bg-success' : 'bg-[#e40c58]'"
      >
        <svg
          v-if="variant === 'sent'"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 10.5l3.5 3.5L15 6.5"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 6l8 8M14 6l-8 8"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <button
      v-if="variant === 'claim'"
      class="flex items-center justify-center hoverOpacityHasBG w-full h-12 rounded-24 bg-primary text-white text-s-16 font-semibold tracking-[-0.32px]"
      @click="emit('claim')"
    >
      {{ claimLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import usdcIcon from '@/assets/images/rwa-rewards/usdc-icon.png'

defineProps<{
  amountLabel: string
  subtitle: string
  variant: 'claim' | 'sent' | 'closed'
  claimLabel?: string
}>()

const emit = defineEmits<{ claim: [] }>()
</script>
