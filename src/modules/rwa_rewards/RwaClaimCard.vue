<template>
  <!-- Alternative (grey) fill: the card sits on the white hero surface. -->
  <AppCard variant="alternative" :title="amountLabel" :description="subtitle">
    <template #avatar>
      <img :src="usdcIcon" alt="" class="size-8" />
    </template>

    <template v-if="variant === 'sent' || variant === 'closed'" #action>
      <!-- m-1 keeps the 24px dot in the header's 32px action box. -->
      <div
        class="m-1 flex size-6 items-center justify-center rounded-full"
        :class="
          variant === 'sent' ? 'bg-background-success' : 'bg-background-error'
        "
      >
        <AppIcon
          :name="variant === 'sent' ? 'check' : 'x-mark'"
          variant="filled"
          size="xxs"
          class="text-white"
        />
      </div>
    </template>

    <template v-if="variant === 'claim'" #buttons>
      <app-base-button
        :is-loading="loading"
        class="text-s-16 font-semibold tracking-[-0.32px]"
        data-test="rwa-claim-card-button"
        @click="onClick"
      >
        {{ buttonLabel }}
      </app-base-button>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppCard from '@/components/card/AppCard.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import usdcIcon from '@/assets/images/rwa-rewards/usdc-icon.png'

const props = defineProps<{
  amountLabel: string
  subtitle: string
  variant: 'claim' | 'sent' | 'closed'
  claimLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{ claim: [] }>()

const { t } = useI18n()
const { isWatchOnly } = storeToRefs(useWalletStore())
const { openAccessDialog } = useAccessStore()

// A watch-only address can't sign the claim, so prompt the user to log in with
// a full wallet instead of letting them hit a claim that would only fail.
const buttonLabel = computed(() =>
  isWatchOnly.value ? t('rwaRewards.login') : props.claimLabel,
)
const onClick = () => {
  if (isWatchOnly.value) {
    openAccessDialog()
    return
  }
  emit('claim')
}
</script>
