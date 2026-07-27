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
        <check-icon v-if="variant === 'sent'" class="w-3.5 h-3.5 text-white" />
        <x-mark-icon v-else class="w-3.5 h-3.5 text-white" />
      </div>
    </div>

    <app-base-button
      v-if="variant === 'claim'"
      :is-loading="loading"
      class="w-full text-s-16 font-semibold tracking-[-0.32px]"
      @click="onClick"
    >
      {{ buttonLabel }}
    </app-base-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/16/solid'
import AppBaseButton from '@/components/AppBaseButton.vue'
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
