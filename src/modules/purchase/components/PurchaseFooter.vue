<template>
  <div class="flex flex-col items-center gap-1.5 w-full">
    <p class="text-[10px] leading-4 text-text-subtle text-center">
      {{ $t('purchase.payment_methods_list') }}
    </p>
    <div class="flex items-center gap-1">
      <AppAvatarCard v-for="method in methods" :key="method" :method="method" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppAvatarCard from '@components/avatar/AppAvatarCard.vue'
import type { PaymentMethod } from '@components/avatar/types'

// Order is driven by design, not by any specific quote.
const methods: PaymentMethod[] = [
  'visa',
  'masterCard',
  'applePay',
  'gPay',
  'pix',
  'paypal',
]
</script>
