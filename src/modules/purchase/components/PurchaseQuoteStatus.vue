<template>
  <p
    v-if="cooldownSeconds !== null"
    class="text-center text-text-sm text-text-error"
    aria-live="polite"
  >
    {{ t('purchase.quote.rate_limited', { seconds: cooldownSeconds }) }}
  </p>
  <p
    v-else-if="quoteExpired"
    class="text-center text-text-sm text-text-subtle"
    aria-live="polite"
  >
    {{ t('purchase.quote.expired_refreshing') }}
  </p>
  <i18n-t
    v-else-if="quoteCountdown"
    keypath="purchase.quote.updates_in"
    tag="p"
    class="text-center text-text-sm text-text-subtle"
  >
    <template #time>
      <span class="text-label-sm text-text-default">
        {{ quoteCountdown }}
      </span>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/** Quote freshness under the Buy / Sell review CTA (Figma "Quote refreshes in"). */
defineProps<{
  quoteCountdown: string
  quoteExpired: boolean
  cooldownSeconds: number | null
}>()

const { t } = useI18n()
</script>
