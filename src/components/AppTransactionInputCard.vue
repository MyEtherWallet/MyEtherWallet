<script setup lang="ts">
import AppInputNaked from '@components/input_naked/AppInputNaked.vue'
import AppChip from '@components/chip/AppChip.vue'

/**
 * Transaction input card (Figma: MEW - Side panel actions › Building blocks,
 * "Transaction input card"). The amount entry shared by every side-panel action:
 * optional title, Input Naked + a picker on the right (with an optional balance
 * line under it), and an optional row of quick-amount chips.
 *
 * The picker is slotted so each action drops in its own (fiat, token, stock…).
 * Errors only recolour the input; the message itself belongs to the CTA, per
 * the design.
 */
export interface QuickAction {
  key: string | number
  label: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    /** Accessible name for the input (it has no visible label). */
    inputLabel: string
    title?: string
    /** Info row once there is a value, e.g. "≈ 0.0513 ETH". */
    conversion?: string
    /** Info row while empty, e.g. "Enter amount". */
    infoMessage?: string
    error?: boolean
    loading?: boolean
    disabled?: boolean
    maxDecimals?: number
    balance?: string
    balanceError?: boolean
    quickActions?: QuickAction[]
  }>(),
  {
    title: '',
    conversion: '',
    infoMessage: '',
    error: false,
    loading: false,
    disabled: false,
    maxDecimals: 18,
    balance: '',
    balanceError: false,
    quickActions: () => [],
  },
)

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  'quick-action': [key: string | number]
  focus: [FocusEvent]
  blur: [FocusEvent]
}>()
</script>

<template>
  <div
    class="flex flex-col gap-6 w-full p-4 rounded-16 bg-background-default"
    data-testid="transaction-input-card"
  >
    <p v-if="title" class="text-text-sm text-text-subtle">{{ title }}</p>

    <div class="flex items-center justify-between gap-2">
      <AppInputNaked
        v-model="model"
        :label="inputLabel"
        :show-currency="false"
        :conversion="conversion"
        :info-message="infoMessage"
        :error="error"
        :loading="loading"
        :disabled="disabled"
        :max-decimals="maxDecimals"
        class="flex-1 min-w-0"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <div class="flex flex-col items-end justify-center gap-2 self-stretch">
        <slot name="picker" />
        <p
          v-if="balance"
          :class="[
            'text-text-sm whitespace-nowrap',
            balanceError ? 'text-text-error' : 'text-text-subtle',
          ]"
          data-testid="transaction-input-card-balance"
        >
          {{ balance }}
        </p>
      </div>
    </div>

    <div v-if="quickActions.length" class="flex items-center gap-2">
      <AppChip
        v-for="action in quickActions"
        :key="action.key"
        :label="action.label"
        :disabled="disabled || action.disabled"
        class="flex-1 min-w-0"
        @click="emit('quick-action', action.key)"
      />
    </div>
  </div>
</template>
