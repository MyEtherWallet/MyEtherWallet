<template>
  <div
    class="flex flex-col"
    style="
      width: 100%;
      gap: 16px;
      padding: 16px;
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      background: #fff;
    "
  >
    <div class="flex items-center" style="gap: 12px; width: 100%">
      <img
        :src="usdcIcon"
        alt=""
        style="width: 32px; height: 32px; flex-shrink: 0"
      />
      <div class="flex flex-col" style="flex: 1; min-width: 0">
        <p
          style="
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            letter-spacing: -0.28px;
            color: #000;
          "
        >
          {{ amountLabel }}
        </p>
        <p style="font-size: 12px; line-height: 18px; color: #575757">
          {{ subtitle }}
        </p>
      </div>
      <div
        v-if="variant === 'sent' || variant === 'closed'"
        class="flex items-center justify-center shrink-0"
        :style="{
          width: '24px',
          height: '24px',
          borderRadius: '100px',
          background: variant === 'sent' ? '#05c0a5' : '#e40c58',
        }"
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
      class="flex items-center justify-center hoverOpacityHasBG"
      style="
        width: 100%;
        height: 48px;
        border-radius: 24px;
        background: #005ae5;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.32px;
      "
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