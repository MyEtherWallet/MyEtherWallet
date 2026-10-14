<script setup lang="ts">
/**
 * Swap / Bridge form (Figma: MEW — Side panel actions › Actions › Swap, Bridge).
 * Two transaction input cards joined by an arrow — the from amount with its %
 * quick actions, the to estimate — each with an optional network picker, then
 * the CTA.
 *
 * Layout only: amounts, tokens and errors are v-models straight into
 * AppSwapEnterAmount, and the CTA just emits `submit`, so the owning module
 * keeps all of the swap logic. The default slot sits between the cards and the
 * CTA (recipient address, alerts); the `cta` slot replaces the button for the
 * connect-wallet / no-balance states.
 */
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppChip from '@/components/chip/AppChip.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import SelectChainPicker from '@/components/select_chain/SelectChainPicker.vue'
import { type NewTokenInfo } from '@/stores/swapStore'
import { type Chain } from '@/mew_api/types'

withDefaults(
  defineProps<{
    fromTokens: NewTokenInfo[] | null
    toTokens: NewTokenInfo[] | null
    fromNetworkName?: string
    toNetworkName?: string
    fromLoading?: boolean
    toLoading?: boolean
    showBalance?: boolean
    isPristine?: boolean
    /** % presets under the from amount; 100 renders as MAX. */
    quickActions?: number[]
    /** From network writes the global chain (SelectChainForApp default). */
    showFromNetwork?: boolean
    fromChains?: Chain[]
    /** The to picker stays mounted while hidden: it seeds the to chain. */
    showToNetwork?: boolean
    toChains?: Chain[]
    toChain?: Chain | null
    ctaLabel: string
    ctaDisabled?: boolean
    /** Figma "Typing/Loading": spinner while the quote loads. */
    ctaLoading?: boolean
  }>(),
  {
    fromNetworkName: undefined,
    toNetworkName: undefined,
    fromLoading: false,
    toLoading: false,
    showBalance: true,
    isPristine: false,
    quickActions: () => [],
    showFromNetwork: false,
    fromChains: () => [],
    showToNetwork: false,
    toChains: () => [],
    toChain: null,
    ctaDisabled: false,
    ctaLoading: false,
  },
)

const fromAmount = defineModel<string>('fromAmount', { required: true })
const fromToken = defineModel<NewTokenInfo>('fromToken')
const fromError = defineModel<string>('fromError', { required: true })
const toAmount = defineModel<string>('toAmount', { required: true })
const toToken = defineModel<NewTokenInfo>('toToken')
const toError = defineModel<string>('toError', { required: true })

const emit = defineEmits<{
  percent: [percentage: number]
  'update:toChain': [chain: Chain]
  submit: []
}>()

const { t } = useI18n()
const chipLabel = (pct: number) => (pct === 100 ? t('common.max') : `${pct}%`)
</script>

<template>
  <div class="flex w-full flex-col gap-5" data-testid="swap-form">
    <div class="flex w-full flex-col">
      <AppSwapEnterAmount
        v-model:amount="fromAmount"
        v-model:selected-token="fromToken"
        v-model:error="fromError"
        :network-name="fromNetworkName"
        :external-loading="fromLoading"
        :tokens="fromTokens"
        :show-balance="showBalance"
        :is-pristine="isPristine"
        sort-context="swap"
      >
        <template v-if="showFromNetwork" #header>
          <SelectChainPicker :passed-chains="fromChains" />
        </template>
        <template v-if="quickActions.length" #actions>
          <AppChip
            v-for="pct in quickActions"
            :key="pct"
            :label="chipLabel(pct)"
            class="flex-1 uppercase"
            @click="emit('percent', pct)"
          />
        </template>
      </AppSwapEnterAmount>

      <!-- The arrow straddles the 8px gap between the two cards -->
      <div class="relative z-10 flex h-2 items-center justify-center">
        <div
          class="absolute flex size-8 items-center justify-center rounded-full bg-background-alternative text-text-brand"
          aria-hidden="true"
          data-testid="swap-form-arrow"
        >
          <AppIcon name="arrow-down" size="xxs" />
        </div>
      </div>

      <AppSwapEnterAmount
        v-model:amount="toAmount"
        v-model:selected-token="toToken"
        v-model:error="toError"
        :network-name="toNetworkName"
        :external-loading="toLoading"
        :tokens="toTokens"
        :show-balance="false"
        :readonly="true"
        :is-estimate="true"
        :is-from-view="false"
        :is-pristine="isPristine"
        sort-context="swap"
      >
        <template #header>
          <SelectChainPicker
            :can-store="false"
            :passed-chains="toChains"
            :preselected-chain="toChain"
            :class="{ hidden: !showToNetwork }"
            @update:selected-chain="emit('update:toChain', $event)"
          />
        </template>
      </AppSwapEnterAmount>
    </div>

    <slot />

    <slot name="cta">
      <AppBaseButton
        class="w-full"
        :disabled="ctaDisabled"
        :is-loading="ctaLoading"
        data-testid="swap-form-cta"
        @click="emit('submit')"
      >
        {{ ctaLabel }}
      </AppBaseButton>
    </slot>
  </div>
</template>
