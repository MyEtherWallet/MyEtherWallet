<script setup lang="ts">
import { computed } from 'vue'
import applePay from '@/assets/icons/payment/apple-pay.png'
import gPay from '@/assets/icons/payment/g-pay.png'
import masterCard from '@/assets/icons/payment/master-card.png'
import paypal from '@/assets/icons/payment/paypal.png'
import pix from '@/assets/icons/payment/pix.png'
import visa from '@/assets/icons/payment/visa.png'
import type { PaymentMethod } from './types'

/**
 * Avatar-Cards (node 520:3673). A payment-method mark on a rounded rectangle,
 * used in the Buy flow. Separate from the circular AppAvatar (different shape,
 * single size), per the design library.
 */
const props = defineProps<{
  method: PaymentMethod
}>()

// Mark asset + its display box (px), centered in the 27×18 card. Sizes are the
// per-variant values from Figma; the marks are raster (no vector in the source).
const MARKS: Record<
  PaymentMethod,
  { src: string; w: number; h: number; label: string }
> = {
  applePay: { src: applePay, w: 19.34, h: 7.95, label: 'Apple Pay' },
  gPay: { src: gPay, w: 21, h: 10, label: 'Google Pay' },
  masterCard: { src: masterCard, w: 17, h: 10, label: 'Mastercard' },
  paypal: { src: paypal, w: 15, h: 14, label: 'PayPal' },
  pix: { src: pix, w: 16.93, h: 6, label: 'Pix' },
  visa: { src: visa, w: 19, h: 6, label: 'Visa' },
}

const mark = computed(() => MARKS[props.method])
</script>

<template>
  <div
    class="relative w-[27px] h-[18px] rounded-[3px] border border-avatar-card-border bg-white overflow-hidden flex items-center justify-center"
  >
    <img
      :src="mark.src"
      :alt="mark.label"
      class="object-contain"
      :style="{ width: `${mark.w}px`, height: `${mark.h}px` }"
    />
  </div>
</template>
