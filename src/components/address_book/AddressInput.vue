<template>
  <div>
    <div class="relative">
      <!-- Blockie -->
      <div
        class="absolute top-[13px] left-[13px] flex items-center pointer-events-none"
      >
        <div
          v-if="!resolvedAddress"
          class="rounded-full bg-grey-5 w-8 h-8 border border-grey-10"
        ></div>
        <img
          v-else
          :src="addressBlockie"
          class="rounded-full w-8 h-8 border border-grey-10"
          height="32"
          width="32"
        />
      </div>
      <!-- Label -->
      <label
        for="address-input"
        :class="[
          'pointer-events-none absolute left-14 transition-all aria-hidden',
          inFocusInput
            ? hasError
              ? 'text-error'
              : 'text-primary'
            : 'text-grey-50',
          inFocusInput || adrInput !== ''
            ? 'top-2 text-s-11'
            : 'top-[18px] text-sm font-medium',
        ]"
      >
        {{ label }}
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
            '!border-primary !border-2': inFocusInput,
            '!text-s-11': adrInput && adrInput.toString().length > 24,
          },
          isRaised
            ? 'shadow-button shadow-button-elevated'
            : 'border border-grey-outline',
          'grow focus:outline-none focus:ring-0 bg-white   text-normal rounded-20 h-[58px] w-full pl-14 pr-20 pt-4 pb-0 text-sm transition-colors font-medium',
        ]"
        :aria-label="label"
        @focus="setInFocusInput()"
        @blur="startOutOfFocusTimeout()"
        autocomplete="off"
        :disabled="isDisabled"
      />
      <!-- Action Buttons  -->
      <div class="absolute top-3 right-3 flex items-center gap-1">
        <app-btn-icon
          label="clear search"
          @click="clearAdrInput"
          v-if="adrInput !== ''"
          class="text-primary"
        >
          <x-circle-icon class="w-6 h-6" />
        </app-btn-icon>
        <app-btn-icon
          label="open address book"
          @click="isAddressBookOpen = true"
          class="text-primary"
        >
          <users-icon class="w-6 h-6" />
        </app-btn-icon>
      </div>
    </div>
    <!-- Error Messages OR Resolved Address -->
    <div class="min-h-6 flex items-center px-4">
      <transition name="fade" mode="out-in">
        <p
          v-if="addressErrorMessages !== '' || resolvedAddress !== ''"
          :class="{
            'text-error': addressErrorMessages,
            'text-info !text-s-11': resolvedAddress,
          }"
          class="text-s-12 truncate"
        >
          {{ addressErrorMessages || foundNickName || resolvedAddress }}
        </p>
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
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { UsersIcon } from '@heroicons/vue/24/solid'
import { ref, computed, watch, nextTick, type PropType } from 'vue'
import createIcon from '@/providers/ethereum/blockies'
import { useInFocusInput } from '@/composables/useInFocusInput'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import AddressBookDialog from './AddressBookDialog.vue'
import type { Chain } from '@/mew_api/types'
import { storeToRefs } from 'pinia'

import { useChainsStore } from '@/stores/chainsStore'
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const props = defineProps({
  label: {
    type: String,
    default: 'To Address',
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
})

const emit = defineEmits([
  'immediate-update:resolved-address',
  'validate:address',
])

const adrInput = defineModel<string>('adrInput', {
  required: false,
})

const isAddressBookOpen = ref(false)

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

//Validate address input when it loses focus
watch(inFocusInput, newValue => {
  if (!newValue) {
    emit('validate:address')
  }
})
</script>
