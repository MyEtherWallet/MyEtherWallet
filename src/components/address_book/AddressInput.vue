<template>
  <div>
    <div class="relative">
      <!-- Blockie -->
      <div
        :class="[
          filled ? 'top-4 left-4' : 'top-[13px] left-[13px]',
          'absolute flex items-center pointer-events-none',
        ]"
      >
        <div
          v-if="!resolvedAddress"
          :class="[
            filled
              ? 'w-6 h-6 bg-white'
              : 'w-8 h-8 bg-background-default border border-border-default',
            'rounded-full',
          ]"
        ></div>
        <img
          v-else
          :src="addressBlockie"
          :class="[
            filled ? 'w-6 h-6' : 'w-8 h-8',
            'rounded-full border border-border-default',
          ]"
          height="32"
          width="32"
        />
      </div>
      <!-- Label -->
      <label
        for="address-input"
        :class="[
          filled ? 'left-12' : 'left-14',
          'pointer-events-none absolute transition-all aria-hidden',
          labelClass,
        ]"
      >
        {{ resolvedLabel }}
      </label>
      <!-- Input  -->
      <input
        id="address-input"
        ref="adrInputRef"
        v-model="adrInput"
        name="address-input"
        type="text"
        :class="[
          {
            '!border-border-brand !border-2': inFocusInput,
            '!text-s-11': adrInput && adrInput.toString().length > 24,
          },
          filled
            ? 'border-0 bg-background-default rounded-12 h-14 pl-12 text-text-sm'
            : [
                isRaised
                  ? 'shadow-button shadow-button-elevated'
                  : 'border border-border-strong',
                'bg-white rounded-20 h-[58px] pl-14 text-sm font-medium',
              ],
          'grow focus:outline-none focus:ring-0 text-text-default w-full pr-20 pt-4 pb-0 transition-colors',
        ]"
        :aria-label="resolvedLabel"
        @focus="setInFocusInput()"
        @blur="startOutOfFocusTimeout()"
        autocomplete="off"
        :disabled="isDisabled"
      />
      <!-- Action Buttons  -->
      <div class="absolute top-3 right-3 flex items-center gap-1">
        <app-btn-icon
          :label="$t('common.clear_search')"
          @click="clearAdrInput"
          v-if="adrInput !== ''"
          :class="filled ? 'text-text-default' : 'text-text-brand'"
        >
          <AppIcon name="x-circle" :size="filled ? 's' : 'm'" />
        </app-btn-icon>
        <app-btn-icon
          :label="$t('common.open_address_book')"
          @click="isAddressBookOpen = true"
          :class="filled ? 'text-text-default' : 'text-text-brand'"
        >
          <AppIcon name="users" variant="filled" :size="filled ? 's' : 'm'" />
        </app-btn-icon>
      </div>
    </div>
    <!-- Error Messages OR Resolved Address -->
    <div :class="{ 'min-h-6': !filled }">
      <transition name="fade" mode="out-in">
        <AppInputFeedback
          v-if="
            (addressErrorMessages !== '' && !isPristine) ||
            resolvedAddress !== ''
          "
          :type="addressErrorMessages && !isPristine ? 'error' : 'text'"
          :message="
            (!isPristine && addressErrorMessages) ||
            foundNickName ||
            resolvedAddress
          "
        />
      </transition>
    </div>

    <address-book-dialog
      v-if="hasAddressBook"
      v-model:is-open="isAddressBookOpen"
      :network="networkChain"
      :selected-address="adrInput"
      @set-selected="setAddress"
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * Address Input Component
 * Displays an input field for entering an address with optional address book functionality.
 * Allows for address resolution and error handling.
 *
 * use with `useAddressInput` composable to manage address input state and validation.
 *
 * @component
 * @example
 *        <address-input
 *         v-model:adr-input="adrInput"
 *         :label="Address"
 *         :resolved-address="resolvedAddress"
 *         :address-error-messages="tadrError"
 *         :chain="selectedChain"
 *         @validate:address="validateAddressInput"
 *         @immediate-update:resolved-address="onInput"
 *       />
 *
 * import { useAddressInput } from '@/composables/useAddressInput'
 *
 * const {
 *  adrInput,
 *  adrError,
 *  resolvedAddress,
 *  onInput,
 *  validateAddressInput } = useAddressInput(selectedChain)
 */
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import { ref, computed, watch, nextTick, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import createIcon from '@/providers/ethereum/blockies'
import { useInFocusInput } from '@/composables/useInFocusInput'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AddressBookDialog from './AddressBookDialog.vue'
import type { Chain } from '@/mew_api/types'
import { storeToRefs } from 'pinia'

import { useChainsStore } from '@/stores/chainsStore'
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const { t } = useI18n()

const props = defineProps({
  label: {
    type: String,
    default: undefined,
  },
  resolvedAddress: {
    type: String,
  },
  addressErrorMessages: {
    type: String,
    default: '',
  },
  hasAddressBook: {
    type: Boolean,
    default: true,
  },
  network: {
    type: Object as PropType<Chain>,
  },
  foundNickName: {
    type: String,
    default: '',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isRaised: {
    type: Boolean,
    default: true,
  },
  /** Design-library "Address input / Filled": grey 56px field, no border or shadow. */
  filled: {
    type: Boolean,
    default: false,
  },
  isPristine: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'immediate-update:resolved-address',
  'validate:address',
])

const adrInput = defineModel<string>('adrInput', {
  required: false,
})

const isAddressBookOpen = ref(false)

const resolvedLabel = computed(() => props.label || t('common.enter_address'))

const addressBlockie = computed(() => {
  const addressToCheck = adrInput.value || props.resolvedAddress
  if (!addressToCheck) return ''
  return createIcon(addressToCheck)
})

const networkChain = computed(() => {
  return props.network || selectedChain.value
})

const clearAdrInput = () => {
  if (props.isDisabled) return
  setInFocusInput()
  nextTick(() => {
    adrInput.value = ''
    emit('immediate-update:resolved-address')
    emit('validate:address')
  })
}

const setAddress = (address: string) => {
  adrInput.value = address
  emit('immediate-update:resolved-address')
  emit('validate:address')
}

watch(
  () => adrInput.value,
  () => {
    emit('validate:address')
  },
)

/**------------------------
 * Error State
 -------------------------*/

const hasError = computed(() => {
  return props.addressErrorMessages !== ''
})

/**------------------------
 * Focus State
 -------------------------*/

const adrInputRef = ref<HTMLElement | null>(null)
const { inFocusInput, setInFocusInput, startOutOfFocusTimeout } =
  useInFocusInput(adrInputRef)

// Floating label: raised above the value once focused or filled, otherwise it
// sits in the field as the placeholder. The filled (design-library) field keeps
// label/xs subtle while focused and rests as a text/sm placeholder.
const labelClass = computed(() => {
  const isRaisedLabel = inFocusInput.value || adrInput.value !== ''
  const isError = inFocusInput.value && hasError.value && !props.isPristine
  if (props.filled) {
    if (!isRaisedLabel) return 'top-[18px] text-text-sm text-text-placeholder'
    return [
      'top-2 text-label-xs',
      isError ? 'text-text-error' : 'text-text-subtle',
    ]
  }
  return [
    isRaisedLabel ? 'top-2 text-s-11' : 'top-[18px] text-sm font-medium',
    inFocusInput.value
      ? isError
        ? 'text-text-error'
        : 'text-text-brand'
      : 'text-text-muted',
  ]
})

//Validate address input when it loses focus
watch(inFocusInput, newValue => {
  if (!newValue) {
    emit('validate:address')
  }
})
</script>
