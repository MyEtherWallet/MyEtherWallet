<template>
  <div class="min-h-[82px]">
    <div class="relative">
      <!-- Blockie -->
      <div class="absolute top-3 left-3 flex items-center pointer-events-none">
        <div
          v-if="!resolvedAddress"
          class="rounded-full bg-surface !w-[32px] h-[32px]"
        ></div>
        <img
          v-else
          :src="addressBlockie"
          class="rounded-full w-[32px] h-[32px]"
          height="30"
          width="30"
        />
      </div>
      <!-- Label -->
      <label
        for="address-input"
        :class="[
          'pointer-events-none absolute top-[17px] left-11 bottom-auto transition-all pl-2 aria-hidden',
          inFocusInput
            ? hasError
              ? 'text-error'
              : 'text-primary'
            : 'text-info',
          {
            'text-[10px] translate-y-[-70%]': inFocusInput || adrInput !== '',
          },
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
            '!border-error border-2': hasError,
          },
          {
            '!border-primary !border-2': inFocusInput && !hasError,
          },
          'grow focus:outline-none focus:ring-0 bg-white shadow-button shadow-button-elevated  text-sm text-normal rounded-16 h-[58px] w-full pl-[50px] pr-[70px] pt-[24px] pb-[12px]  transition-colors',
        ]"
        :aria-label="label"
        @focus="setInFocusInput()"
        @blur="startOutOfFocusTimeout()"
        autocomplete="off"
      />
      <!-- Clear Input  -->
      <app-btn-icon
        class="absolute top-3 right-11"
        label="clear search"
        @click="clearAdrInput"
        :class="[
          adrInput !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
      >
        <x-circle-icon class="w-6 h-6 text-primary" />
      </app-btn-icon>
      <!-- Open Address Book button-->
      <app-btn-icon
        v-if="hasAddressBook"
        class="absolute top-3 right-3"
        label="open address book"
        @click="isAddressBookOpen = true"
      >
        <users-icon class="w-6 h-6 text-primary" />
      </app-btn-icon>
    </div>
    <!-- Error Messages OR Resolved Address -->
    <transition name="fade" mode="out-in">
      <p
        v-if="addressErrorMessages !== '' || resolvedAddress !== ''"
        :class="{
          'text-error': addressErrorMessages,
          'text-info': resolvedAddress,
        }"
        class="text-[10px] xs:text-s-12 leading-[23px] pl-5"
      >
        {{ addressErrorMessages || resolvedAddress }}
      </p>
    </transition>
    <address-book-dialog
      v-if="hasAddressBook"
      v-model:is-open="isAddressBookOpen"
      :network="network"
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
  const addressToCheck = props.resolvedAddress || adrInput.value
  if (!addressToCheck) return ''
  return createIcon(addressToCheck)
})

const clearAdrInput = () => {
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
