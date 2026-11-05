<script setup lang="ts">
import AppInputNaked from '@components/input_naked/AppInputNaked.vue'
import AppChip from '@components/chip/AppChip.vue'
import AppSpinner from '@components/spinner/AppSpinner.vue'
import { computed, useId } from 'vue'

/**
 * Transaction input card (Figma: MEW - Side panel actions › Building blocks,
 * "Transaction input card"). The amount entry shared by every side-panel action:
 * optional title, Input Naked + a picker on the right (with an optional balance
 * line under it), and an optional row of quick-amount chips.
 *
 * The picker is slotted so each action drops in its own (fiat, token, stock…).
 * Errors only recolour the input; the message itself belongs to the CTA, per
 * the design.
 *
 * Two rows, [value | picker] and [info | balance], instead of Input Naked's own
 * info row: a long balance would otherwise squeeze the value and the info text
 * would run into it.
 *
 * Optional slots for the other side-panel actions: `header` above the amount
 * (Bridge's network picker), `feedback` under it (Swap / Send keep their error
 * message there), and `actions` to replace the chip row with custom content.
 */
export interface QuickAction {
  key: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
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
    /** Output-only amount (e.g. a quote result): shown, never typed. */
    readonly?: boolean
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
    readonly: false,
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

const infoId = `transaction-input-card-info-${useId()}`

const infoText = computed(() =>
  model.value ? props.conversion : props.infoMessage,
)
const hasInfoRow = computed(
  () => props.loading || !!infoText.value || !!props.balance,
)

const infoColorClass = computed(() => {
  if (props.disabled) return 'text-text-disabled'
  return props.error ? 'text-text-error' : 'text-text-subtle'
})
</script>

<template>
  <div
    class="flex flex-col gap-6 w-full p-4 rounded-16 bg-background-default"
    data-testid="transaction-input-card"
  >
    <p v-if="title" class="text-text-sm text-text-subtle">{{ title }}</p>

    <div class="flex flex-col gap-1">
      <!-- 12px above the amount, like the Bridge network picker in Figma -->
      <div v-if="$slots.header" class="mb-2">
        <slot name="header" />
      </div>
      <div class="flex items-center justify-between gap-2">
        <AppInputNaked
          v-model="model"
          :label="inputLabel"
          :show-currency="false"
          :error="error"
          :disabled="disabled"
          :readonly="readonly || undefined"
          :max-decimals="maxDecimals"
          :aria-describedby="hasInfoRow ? infoId : undefined"
          class="flex-1 min-w-0"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        />
        <div class="shrink-0">
          <slot name="picker" />
        </div>
      </div>

      <div
        v-if="hasInfoRow"
        class="flex items-center justify-between gap-2 h-5 text-text-sm"
        :aria-busy="loading || undefined"
      >
        <div
          :id="infoId"
          :class="['shrink-0 whitespace-nowrap', infoColorClass]"
          data-testid="transaction-input-card-info"
        >
          <AppSpinner v-if="loading" :size="20" />
          <template v-else>{{ infoText }}</template>
        </div>
        <p
          v-if="balance"
          :class="[
            'min-w-0 truncate',
            balanceError ? 'text-text-error' : 'text-text-subtle',
          ]"
          data-testid="transaction-input-card-balance"
        >
          {{ balance }}
        </p>
      </div>
      <slot name="feedback" />
    </div>

    <div
      v-if="quickActions.length || $slots.actions"
      class="flex items-center gap-2"
    >
      <slot name="actions">
        <AppChip
          v-for="action in quickActions"
          :key="action.key"
          :label="action.label"
          :disabled="disabled || action.disabled"
          class="flex-1 min-w-0"
          @click="emit('quick-action', action.key)"
        />
      </slot>
    </div>
  </div>
</template>
